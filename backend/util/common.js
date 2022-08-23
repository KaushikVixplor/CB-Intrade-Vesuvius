const moment = require("moment");
const fs= require("fs");

async function getDate(date) {
  return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
}

const getUpdatedText = async (text,variables) => {
  try{
          console.error("variables = ",variables)
          var updatedText = text
          for(i=0;i<variables.length;i++){
              try{
                  var symbol = "<<"+i.toString()+">>"
                  console.error("symbol = ",symbol)
                  console.error("variables[i] = ",variables[i])
                  // console.error("updatedText = ",updatedText)
                  updatedText = updatedText.replace(symbol,variables[i])
                  // console.error("updatedText = ",updatedText)
              }
              catch(error){
                  console.error("getUpdatedText:: error in loop: ",error)
              }
          }
          return updatedText
  }
  catch(error){
      console.error("getUpdatedText:: error: ",error)
      throw error
  }
}


const deleteLocalFile = async (filePath) => {
  try{
      fs.unlinkSync(filePath)
  }
  catch(error){
      console.error("deleteLocalFile:: error: ",error)
      throw error
  }
}


const getPdf = async (filePath) => {
  try{
          var buffer = await fs.readFileSync(filePath)
          return buffer
  }
  catch(error){
      console.error("getPdf:: error: ",error)
      throw error
  }
}


const getCredentialsText = async (text,credentials) => {
  try{ 
      if(text.includes("#credentials")){
        // console.error("getCredentialsText:: ",text)
        updatedText = text.replace("#credentials","login with following details:\nURL: <<0>>\nEmail: <<1>>\n")
        updatedText = await getUpdatedText(updatedText,credentials)
        // console.error("getCredentialsText:: ",updatedText)
        return updatedText
      }
      else{
        return text
      }
  }
  catch(error){
      console.error("getCredentialsText:: error: ",error)
      throw error
  }
}

const compareTransaction = async (param) => {
  var transactionData = param;
  var current_benpos_data = transactionData.current_benpos_data.sort((a, b)=> (a.pan < b.pan) ? 1 : -1);
  var prev_benpos_data = transactionData.prev_benpos_data.sort((a, b)=> (a.pan < b.pan) ? 1 : -1 );
  try {
    var data = [];
    var i=0, j=0, k=0;
    var prev_pan = null;
    var prev_folio = null;
    while (i < prev_benpos_data.length && j < current_benpos_data.length) {
      var obj = new Object();
      obj.folio = [];
      if (prev_benpos_data[i].pan == current_benpos_data[j].pan) {
          if (prev_pan != prev_benpos_data[i].pan) {
            obj.code = current_benpos_data[j].Folio.Employee.emp_code;
            obj.pan = current_benpos_data[j].Folio.Employee.pan;
            obj.name = current_benpos_data[j].Folio.Employee.name;
            var curr = current_benpos_data[j].total_share;
            var prev = prev_benpos_data[i].total_share;
            obj.sell = curr - prev;
            obj.valid = current_benpos_data[j].is_valid ? "Valid" : "Invalid";
            obj.curr = curr;
            obj.prev = prev;
            obj.reqStatus =  current_benpos_data[j].Requests.length == 0 ? "No Data" : current_benpos_data[j].Requests[current_benpos_data[j].Requests.length-1].status;
            obj.apprDate = current_benpos_data[j].Requests.length == 0 ? "No Data" : current_benpos_data[j].Requests[current_benpos_data[j].Requests.length-1].status;
            obj.folio.push(current_benpos_data[j].transaction_folio);
            data[k] = obj;
            prev_pan = current_benpos_data[j].Folio.Employee.pan;
            i++;
            j++;
            k++;
          } else {
            data[k-1].folio.push(prev_benpos_data[i].transaction_folio);
            i++;
            j++;
          }
      } else {
        if (prev_benpos_data[i].pan == prev_pan) {
          data[k-1].folio.push(prev_benpos_data[i].transaction_folio);
          i++;
        } else if (current_benpos_data[j].pan == prev_pan) {
          data[k-1].folio.push(current_benpos_data[j].transaction_folio);
          j++;
        } else {
          if (prev_benpos_data.length - i > current_benpos_data.length - j) {
            obj.code = prev_benpos_data[i].Folio.Employee.emp_code;
            obj.pan = prev_benpos_data[i].Folio.Employee.pan;
            obj.name = prev_benpos_data[i].Folio.Employee.name;
            var curr = 0;
            var prev = prev_benpos_data[i].total_share;
            obj.sell = curr - prev;
            obj.valid = prev_benpos_data[i].is_valid ? "Valid" : "Invalid";
            obj.curr = curr;
            obj.prev = prev;
            obj.reqStatus =  prev_benpos_data[i].Requests.length == 0 ? "No Data" : prev_benpos_data[i].Requests[prev_benpos_data[i].Requests.length-1].status;
            obj.apprDate = prev_benpos_data[i].Requests.length == 0 ? "No Data" : prev_benpos_data[i].Requests[prev_benpos_data[i].Requests.length-1].status;
            obj.folio.push(prev_benpos_data[i].transaction_folio);
            data[k] = obj;
            prev_pan = prev_benpos_data[i].Folio.Employee.pan;
            i++;
            k++;
          } else {
            obj.code = current_benpos_data[j].Folio.Employee.emp_code;
            obj.pan = current_benpos_data[j].Folio.Employee.pan;
            obj.name = current_benpos_data[j].Folio.Employee.name;
            var curr = current_benpos_data[j].total_share;
            var prev = 0;
            obj.sell = curr - prev;
            obj.valid = current_benpos_data[j].is_valid ? "Valid" : "Invalid";
            obj.curr = curr;
            obj.prev = prev;
            obj.reqStatus =  current_benpos_data[j].Requests.length == 0 ? "No Data" : current_benpos_data[j].Requests[current_benpos_data[j].Requests.length-1].status;
            obj.apprDate = current_benpos_data[j].Requests.length == 0 ? "No Data" : current_benpos_data[j].Requests[current_benpos_data[j].Requests.length-1].status;
            obj.folio.push(current_benpos_data[j].transaction_folio);
            data[k] = obj;
            prev_pan = current_benpos_data[j].Folio.Employee.pan;
            j++;
            k++;
          }
        }
      }
    }
    while (i < prev_benpos_data.length) {
      var obj = new Object();
      obj.folio = [];
      if (prev_benpos_data[i].Folio.Employee.pan == prev_pan) {
        data[k-1].folio.push(prev_benpos_data[i].transaction_folio);
        i++;
      }else {
        obj.code = prev_benpos_data[i].Folio.Employee.emp_code;
        obj.pan = prev_benpos_data[i].Folio.Employee.pan;
        obj.name = prev_benpos_data[i].Folio.Employee.name;
        var curr = 0;
        var prev = prev_benpos_data[i].total_share;
        obj.sell = curr - prev;
        obj.valid = prev_benpos_data[i].is_valid ? "Valid" : "Invalid";
        obj.curr = curr;
        obj.prev = prev;
        obj.reqStatus =  prev_benpos_data[i].Requests.length == 0 ? "No Data" : prev_benpos_data[i].Requests[prev_benpos_data[i].Requests.length-1].status;
        obj.apprDate = prev_benpos_data[i].Requests.length == 0 ? "No Data" : prev_benpos_data[i].Requests[prev_benpos_data[i].Requests.length-1].status;
        obj.folio.push(prev_benpos_data[i].transaction_folio);
        data[k] = obj;
        prev_pan = prev_benpos_data[i].Folio.Employee.pan;
        i++;
        k++;
      }
    }
    while (j < current_benpos_data.length) {
      var obj = new Object();
      obj.folio = [];
      if (current_benpos_data[j].Folio.Employee.pan == prev_pan) {
        data[k-1].folio.push(current_benpos_data[j].transaction_folio);
        j++;
      } else {
        obj.code = current_benpos_data[j].Folio.Employee.emp_code;
        obj.pan = current_benpos_data[j].Folio.Employee.pan;
        obj.name = current_benpos_data[j].Folio.Employee.name;
        var curr = current_benpos_data[j].total_share;
        var prev = 0;
        obj.sell = curr - prev;
        obj.valid = current_benpos_data[j].is_valid ? "Valid" : "Invalid";
        obj.curr = curr;
        obj.prev = prev;
        obj.reqStatus =  current_benpos_data[j].Requests.length == 0 ? "No Data" : current_benpos_data[j].Requests[current_benpos_data[j].Requests.length-1].status;
        obj.apprDate = current_benpos_data[j].Requests.length == 0 ? "No Data" : current_benpos_data[j].Requests[current_benpos_data[j].Requests.length-1].status;
        obj.folio.push(current_benpos_data[j].transaction_folio);
        data[k] = obj;
        prev_pan = current_benpos_data[j].Folio.Employee.pan;
        j++;
        k++;
      }
    }
    return data;
  }catch(err){
    throw err;
  }
};

const getViolationData = async (params) => {
  var body = params.sort((a, b)=> (a.pan < b.pan) ? -1 : 1 );
  try {
    var data =[];
    var k = 0;
    var prev_pan = null;
    // var prev_date = null;
    for (var i=0; i<body.length; i++) {
      var obj = Object();
      obj.folio = [];
      if (prev_pan != body[i].pan) {
        obj.code = body[i].Folio.Employee.emp_code;
        obj.pan = body[i].pan;
        obj.name = body[i].Folio.Employee.name;
        var curr = body[i].total_share;
        var prev = body[i].previous_total_share;
        obj.sell = curr - prev;
        var d = new Date(body[i].current_benpos_date);
        obj.benpose_date = await getDate(d);
        obj.curr = curr;
        obj.prev = prev;
        obj.reqStatus =  body[i].Requests.length == 0 ? "No Data" : body[i].Requests[body[i].Requests.length-1].status;
        obj.apprDate = body[i].Requests.length == 0 ? "No Data" : body[i].Requests[body[i].Requests.length-1].status;
        obj.folio.push(body[i].Folio.folio);
        data[k] = obj;
        prev_pan = body[i].pan;
        // prev_date = moment(body[i].current_benpos_date).format("d/mm/yyyy");
        k++;
      } else
      {
        var flag = false;
        var s = 0;
        for(s=0; s<data.length; s++) {
          // console.log("data", data);
          console.log("------------------------")
          var date1 = new Date(body[i].current_benpos_date);
          var date2 = data[s].benpose_date;
          console.log(date1);
          console.log(data[s].benpose_date);
          var a = await getDate(date1);
          var b = date2; 
          console.log(a);
          console.log(b);
          if(a == b && data[s].pan == body[i].pan) {
            flag = true;
            break;
          }
        }
        if(flag) {
          console.log("THIS");
          data[s].folio.push(body[i].Folio.folio);
        } else {
          obj.code = body[i].Folio.Employee.emp_code;
          obj.pan = body[i].pan;
          obj.name = body[i].Folio.Employee.name;
          var curr = body[i].total_share;
          var prev = body[i].previous_total_share;
          obj.sell = curr - prev;
          var d = new Date(body[i].current_benpos_date);
          obj.benpose_date = await getDate(d);
          obj.curr = curr;
          obj.prev = prev;
          obj.reqStatus =  body[i].Requests.length == 0 ? "No Data" : body[i].Requests[body[i].Requests.length-1].status;
          obj.apprDate = body[i].Requests.length == 0 ? "No Data" : body[i].Requests[body[i].Requests.length-1].status;
          obj.folio.push(body[i].Folio.folio);
          data[k] = obj;
          prev_pan = body[i].pan;
          // prev_date = body[i].current_benpos_date;
          k++;
        }
      }
    }
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports ={
  getUpdatedText,
  compareTransaction,
  getViolationData,
  getCredentialsText,
  getPdf
}