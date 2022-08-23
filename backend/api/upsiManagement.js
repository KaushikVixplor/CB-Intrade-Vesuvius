var sequelize = require('sequelize');
const Op = sequelize.Op;
var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
const pattern1 = /(\d{2})\-(\d{2})\-(\d{4})/;
const sentMail = require('../util/SentMail');
const localUpload = require('../util/storageLocal').upload;
const localgetPublicUrl = require('../util/storageLocal').getPublicUrl;
const getPdf = require('../util/common').getPdf;
const fs = require('fs');


module.exports = (app, db) =>
{

    async function getDate(dateString){
        var newDate = new Date()
        if(dateString.includes("/")){
            newDate = new Date(new Date(dateString.replace(pattern,'$3-$2-$1')).setHours(0,0,0))
        }
        else{
            newDate = new Date(new Date(dateString.replace(pattern1,'$3-$2-$1')).setHours(0,0,0))
        }
        // offset = 5.5
        // newDate = newDate + (3600000 * offset)
        // newDate = new Date(newDate)
        return newDate
    }



    async function getNames(mailIds){
        var names = ""
        for(i=0; i<mailIds.length; i++){

            var data = await db.Employees.findOne({
                where:{
                    email: mailIds[i]
                }
            })
            if(data){
                names = names + data.name + ","
            }
            else{
                names = names + mailIds[i] + ","
            }
        }
        names = names.substring(0,names.length-1)
        return names
    }


    
    app.post('/upsiA', async (req,res) => {
        console.error("req user", req.user)
        try{
            
            var shared_by = req.body.shared_by
            var shared_with = req.body.shared_with
            var shared_by_info = await getNames(shared_by)
            // for(k=0;k<shared_by.length;k++){
            //     shared_by_info += shared_by[k]+","
            // }
            // shared_by_info = shared_by_info.substring(0,shared_by_info.length-1)
            var shared_with_info = await getNames(shared_with)
            // for(j=0;j<shared_with.length;j++){
            //     shared_with_info += shared_with[j]+","
            // }
            // shared_with_info = shared_with_info.substring(0,shared_with_info.length-1)
            console.error("shared_by_info = ",shared_by_info)
            console.error("shared_with_info = ",shared_with_info)
            req.body.shared_by = shared_by_info
            req.body.shared_with = shared_with_info
            var information = req.body.information|| ""
            var subject = "Disclaimer for UPSI Share"
            if("subject" in req.body){
                if(req.body.subject != "" || req.body.subject != " "){
                    subject = req.body.subject
                }
            }
            req.body.subject = subject
            var nowDate = new Date()
            var coData = await db.Employees.findOne({
                where:{
                    is_active: true,
                    is_compliance: true
                }
            })
            // var companyData = await db.Company.findOne({
            //     where:{
            //         id: req.user.companyId
            //     }
            // })
            // add UPSI Log
            const UPSILogsData = await db.UPSILogs.create(req.body)
            var Disclaimer = "Dear Insider,\n\n"
            // Disclaimer = Disclaimer+"The UPSI is shared with you on a need-to-know basis.You should maintain the confidentiality of all the Price-Sensitive Information and should not pass on such information to any person directly or indirectly, by way of making a recommendation for the purchase or sale of securities relating to "+companyData.name+".\n"
            Disclaimer = Disclaimer+"\n"+information+"\n\n"
            Disclaimer = Disclaimer+"Yours faithfully,\n"+coData.name+"\nCompliance Officer"

            // shared_by = shared_by.split(",")
            // shared_with = shared_with.split(",")

            // sending mail
            var mailresponses = []
            for(x=0; x<shared_with.length; x++){
                var mailRes = await sentMail.sentMail({
                    to: shared_with[x],
                    subject: subject,
                    text: Disclaimer
                })
                mailresponses.push(mailRes)
            }
            res.status(200).json({'message':'UPSI Shared successfully','mailresponses': mailresponses}); 

        }
        catch(error){
            console.error("upsi info add error", error);
            res.status(500).json({message:"upsi info add error:: "+error})
        }
    })
    



    app.post("/upsi", async (req, res) => {
        try {
          var out = await localUpload.fields([
            { name: "attachment", maxCount: 1 },
          ])(req, res, async function (err) {
            try {
              if (err) {
                console.log(err);
                throw err;
              } else{
                    url = null;
                    attachmentFile = []
                    if (req.files["attachment"] && req.files["attachment"][0]) {
                        url = await localgetPublicUrl(
                            req.files["attachment"][0].filename
                            ? req.files["attachment"][0].filename
                            : req.files["attachment"][0].key
                            ? req.files["attachment"][0].key
                            : req.files["attachment"][0].originalname
                        );
                    }
                    console.log(req.body.data);
                    req.body.data = JSON.parse(req.body.data);
                    console.log(req.body.data);
                    var shared_by = req.body.data.shared_by
                    var shared_with = req.body.data.shared_with
                    var shared_by_info = await getNames(shared_by)
                    // for(k=0;k<shared_by.length;k++){
                    //     shared_by_info += shared_by[k]+","
                    // }
                    // shared_by_info = shared_by_info.substring(0,shared_by_info.length-1)
                    var shared_with_info = await getNames(shared_with)
                    // for(j=0;j<shared_with.length;j++){
                    //     shared_with_info += shared_with[j]+","
                    // }
                    // shared_with_info = shared_with_info.substring(0,shared_with_info.length-1)
                    console.error("shared_by_info = ",shared_by_info)
                    console.error("shared_with_info = ",shared_with_info)
                    req.body.data.shared_by = shared_by_info
                    req.body.data.shared_with = shared_with_info
                    var information = req.body.data.information|| ""
                    var subject = "Disclaimer for UPSI Share"
                    if("subject" in req.body.data){
                        if(req.body.data.subject != "" || req.body.data.subject != " "){
                            subject = req.body.data.subject
                        }
                    }
                    req.body.data.subject = subject
                    var nowDate = new Date()
                    var coData = await db.Employees.findOne({
                        where:{
                            is_active: true,
                            is_compliance: true
                        }
                    })
                    // var companyData = await db.Company.findOne({
                    //     where:{
                    //         id: req.user.companyId
                    //     }
                    // })
                    // add UPSI Log
                    const UPSILogsData = await db.UPSILogs.create(req.body.data)
                    var Disclaimer = "Dear Insider,\n\n"
                    // Disclaimer = Disclaimer+"The UPSI is shared with you on a need-to-know basis.You should maintain the confidentiality of all the Price-Sensitive Information and should not pass on such information to any person directly or indirectly, by way of making a recommendation for the purchase or sale of securities relating to "+companyData.name+".\n"
                    Disclaimer = Disclaimer+"\n"+information+"\n\n"
                    Disclaimer = Disclaimer+"Yours faithfully,\n"+coData.name+"\nCompliance Officer"

                    // shared_by = shared_by.split(",")
                    // shared_with = shared_with.split(",")

                    // sending mail
                    var mailresponses = []
                    if(url) {
                        doc = await getPdf(url)
                        attachmentFile.push({
                            filename: 'attachment.pdf',
                            content: doc
                        })
                    }
                    for(x=0; x<shared_with.length; x++){
                        var mailRes = await sentMail.sentMail({
                            to: shared_with[x],
                            subject: subject,
                            text: Disclaimer,
                            attachments: attachmentFile
                        })
                        mailresponses.push(mailRes)
                    }
                    if(url){
                        fs.unlinkSync(url)
                    }
                    res.status(200).json({'message':'UPSI Shared successfully','mailresponses': mailresponses}); 
                }
            } catch (err) {
              console.log(err);
              res.status(500).json({ message: "Error to create user" });
            }
          });
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Error to create user" });
        }
      });

      



    app.get('/upsi', async (req,res) => {
        console.error("req user", req.user)
        try{
            fromDateStr = req.query.startDate
            toDateStr = req.query.endDate 
            console.error("fromDateStr = ",fromDateStr)
            console.error("toDateStr = ",toDateStr)
            let fromDate
            let toDate
            if(fromDateStr.includes("/") || fromDateStr.includes("-")){
                fromDate = await getDate(fromDateStr)
                fromDate = new Date(fromDate.setHours(00,00,00))
            }
            else{
                throw "Date Format Error"
            }
            if(toDateStr.includes("/") || toDateStr.includes("-")){
                toDate = await getDate(toDateStr)
                toDate = new Date(toDate.setHours(23,59,59))
            }
            else{
                throw "Date Format Error"
            }
            var UPSILogsData = await db.UPSILogs.findAll({
                where:{
                    createdAt: {[Op.between] : [fromDate,toDate]}
                }
            })
            res.status(200).json({'message':'UPSI fetched successfully','data': UPSILogsData}); 

        }
        catch(error){
            console.error("upsi info fetch error", error);
            res.status(500).json({message:"upsi info fetch error:: "+error})
        }
    })

}

