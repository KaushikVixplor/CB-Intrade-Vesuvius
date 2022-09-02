const config = {
  development: {
    'accessTokenSecret' : "NwqeSDI3WCYJBnn1YY5Yaq2,96y59rn8",
    'refreshAccessTokenSecret' : "truyiUIIViBubi63WPlmwaczx7f4s20l",
    'expTime' : "20m",
    logging: false,
    "code":"CBMSL",
    "name":"CB Management Services(P) Ltd.",
    "isin":"INR000003324",
    "cin":"U74140WB1994PTC062959",
    "address":"P-22, Bondel Road, Kolkata - 700019",
    "city":"Kolkata",
    "state":"West Bengal",
    "pin":"700019",
    "phone":"(033)4011-6700",
    "fax":"(033)4011 6739",
    "website": "www.cbmsl.com",
    "email":"rta@cbmsl.com",
    "total_capital":"4200000",
    "share_value":"136",
    "meta_tag": "CB-Intrade",
    "contact_person":"ANJAN MANDAL",
    "window_close_from" : "",
    "window_close_to" : "",
    "CO":{
      pan: "NOPAN00000",
      emp_code: "000001",
      name: "Subhabrata Biswas",
      email:"kaushik.r@vixplor.com",
      designation: "Vice President",
      phone: "(033)4011 6715",
      address: "P-22, Bondel Road, Kolkata - 700019",
      total_share: 0,
      last_benpos_date:"",
      date_of_appointment_as_insider: "16/04/2016",
      last_institute: "",
      last_employer: "",
      is_compliance: true,
      is_active: true,
      status: "Active"
    },
    "username": "sa",
    "password": "vixplor12345",
    "database": "CBMSLDev",
    "host": "127.0.0.1",
    "dialect": "mssql",
    port: "1433",
    backupLocation: "backup",
    mailId:'quicser.sender@gmail.com',
    mailPassword:'dxsoluynimtaatnv',
	  backendUrl:'http://localhost:8080',
    credentials: ['pan','folio']
  },
  test: {
    'accessTokenSecret' : "NwqeSDI3WCYJBnn1YY5Yaq2,96y59rn8",
    'refreshAccessTokenSecret' : "truyiUIIViBubi63WPlmwaczx7f4s20l",
    'expTime' : "20m",
    logging: false,
    "code":"AKZOINDIA",
    "name":"Akzo Nobel India Ltd",
    "isin":"INE133A01011",
    "cin":"L24292WB1954PLC021516",
    "address":"Geetanjali Apartment, 1st Floor. 8B Middleton Street, Kolkata 700071",
    "city":"Kolkata",
    "state":"West Bengal",
    "pin":"700071",
    "phone":"8336967462",
    "fax":"033-22277925",
    "website": "www.akzonobel.co.in",
    "email":"customercare.india@akzonobel.com",
    "total_capital":"45540314",
    "share_value":"2213.55",
    "meta_tag": "AkzoNobel India Structured Digital Database",
    "contact_person":"Thomas V. A.",
    "window_close_from" : "",
    "window_close_to" : "",
    "CO":{
      pan: "C-ACGPR8240M",
      emp_code: "40055208",
      name: "Harshi Rastogi",
      email:"harshi.rastogi@akzonobel.com",
      designation: "Company Secretary",
      phone: "919818876724",
      address: "C2-503, The Legend, Sushant Lok Phase 3, sector 57",
      total_share: 0,
      last_benpos_date:"",
      date_of_appointment_as_insider: "16/04/2016",
      last_institute: "ICAI",
      last_employer: "Unilever",
      is_compliance: true,
      is_active: true,
      status: "Active"
    },
    "username": "postgres",
    "password": "mk9874pE",
    "database": "akzonovel",
    "host": "database-1.c4nhcvnwgwym.ap-south-1.rds.amazonaws.com",
    "dialect": "postgres",
    port: "5432",
    backupLocation: "backup",
    mailId:'compliance@anisdd.com',
    mailPassword:'mk9874pE@',
    backendUrl:'https://www.anisdd.com/',
    credentials: ['pan','folio']
  },
  production: {
    'accessTokenSecret' : "NwqeSDI3WCYJBnn1YY5Yaq2,96y59rn8",
    'refreshAccessTokenSecret' : "truyiUIIViBubi63WPlmwaczx7f4s20l",
    'expTime' : "20m",
    logging: false,
    "code":"CBMSL",
    "name":"CB Management Services(P) Ltd.",
    "isin":"INR000003324",
    "cin":"U74140WB1994PTC062959",
    "address":"P-22, Bondel Road, Kolkata - 700019",
    "city":"Kolkata",
    "state":"West Bengal",
    "pin":"700019",
    "phone":"(033)4011-6700",
    "fax":"(033)4011 6739",
    "website": "www.cbmsl.com",
    "email":"rta@cbmsl.com",
    "total_capital":"4200000",
    "share_value":"136",
    "meta_tag": "CB-Intrade",
    "contact_person":"ANJAN MANDAL",
    "window_close_from" : "",
    "window_close_to" : "",
    "CO":{
      pan: "NOPAN00000",
      emp_code: "000001",
      name: "Subhabrata Biswas",
      email:"subhabrata@cbmsl.co",
      designation: "Vice President",
      phone: "(033)4011 6715",
      address: "P-22, Bondel Road, Kolkata - 700019",
      total_share: 0,
      last_benpos_date:"",
      date_of_appointment_as_insider: "16/04/2016",
      last_institute: "",
      last_employer: "",
      is_compliance: true,
      is_active: true,
      status: "Active"
    },
    "username": "postgres",
    "password": "vixplor12345",
    "database": "CBMSL",
    "host": "database-1.ccuvimy1g5m8.ap-south-1.rds.amazonaws.com",
    "dialect": "postgres",
    port: "5432",
    backupLocation: "backup",
    mailId:'quicser.sender@gmail.com',
    mailPassword:'dxsoluynimtaatnv',
	  backendUrl:'http://cbintrade.s3-website.ap-south-1.amazonaws.com',
    credentials: ['pan','folio']
  },
};

module.exports = config;
