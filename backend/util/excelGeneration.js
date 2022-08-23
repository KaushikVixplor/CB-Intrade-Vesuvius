const moment = require("moment");
var XLSX = require('xlsx');


async function getDateString(dateObj){
    try{
        var dateStr = dateObj.getDate()+"-"+(dateObj.getMonth()+1)+"-"+dateObj.getFullYear()
        return dateStr
    }
    catch(error){
        console.error("getDateString:: ",error)
        throw error
    }
}




const getConnectedPersonsExcel = async (body) => {
    try{
        var headers = ["SL.", "Emp. Code", "Name", "Email", "PAN", "Designation", "Status", "Appointed On", "Folio 1", "Share 1", "Folio 2", "Share 2","Folio 3", "Share 3","Folio 4", "Share 4","Folio 5", "Share 5",]
        var tbody = [];
        for(var i=0; i<body.length; i++){
            var row = {};
            row[headers[0]] = i+1;
            row[headers[1]] = body[i].emp_code;
            row[headers[2]] = body[i].name;
            row[headers[3]] = body[i].email;
            row[headers[4]] = body[i].pan;
            row[headers[5]] = body[i].designation;
            row[headers[6]] = body[i].status;
            const date = new Date(body[i].createdAt);  
            var d = moment(date).format('d/mm/YYYY');
            row[headers[7]] = d;

            // Folio 1 details
            row[headers[8]] = body[i].Folios[0] ? body[i].Folios[0].folio : "NA";
            row[headers[9]] = body[i].Folios[0] ? body[i].Folios[0].current_share : "NA";
            // Folio 2 details
            row[headers[10]] = body[i].Folios[1] ? body[i].Folios[1].folio : "NA";
            row[headers[11]] = body[i].Folios[1] ? body[i].Folios[1].current_share : "NA";
            // Folio 3 details
            row[headers[12]] = body[i].Folios[2] ? body[i].Folios[2].folio : "NA";
            row[headers[13]] = body[i].Folios[2] ? body[i].Folios[2].current_share : "NA";
            // Folio 4 details
            row[headers[14]] = body[i].Folios[3] ? body[i].Folios[3].folio : "NA";
            row[headers[15]] = body[i].Folios[3] ? body[i].Folios[3].current_share : "NA";
            // Folio 5 details
            row[headers[16]] = body[i].Folios[3] ? body[i].Folios[3].folio : "NA";
            row[headers[17]] = body[i].Folios[3] ? body[i].Folios[3].current_share : "NA";
            tbody.push(row);
        }
        // // Reading our test file
        // const file = reader.readFile('./test.xlsx')
        
        // // Sample data set
        // let student_data = [{
        //     Student:'Nikhil',
        //     Age:22,
        //     Branch:'ISE',
        //     Marks: 70
        // },
        // {
        //     Student:'Amitha',
        //     Age:21,
        //     Branch:'EC',
        //     Marks:80
        // }]
        
        const ws = XLSX.utils.json_to_sheet(tbody)
        
        // reader.utils.book_append_sheet(file,ws,"Sheet3")
        
        // // Writing to our file
        // reader.writeFile(file,'./test.xlsx')
        return ws;
    }catch(err){
        throw err;
    }
};



module.exports = {
    getConnectedPersonsExcel
}