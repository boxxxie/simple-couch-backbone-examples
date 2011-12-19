var default_menu_item =        {
    "display": {
        "is_enabled": false,
        "image": "",
        "color": "255,255,255",
        "screen": 1,
        "position": 0,
        "description": [" ", " ", " "]
    },
    "foodItem": {
        "price": 0,
        "apply_taxes": {
            "exemption": false,
            "tax1": true,
            "tax2": true,
            "tax3": false
        },
        "use_scale": false,
        "print_to_kitchen": false,
        "duplicate": false,
        "has_modifier": false
    }
};
var sample_terminal ={
   "_id": "RT7-RT7-35",
   "_rev": "10-1d175e2c88877124c04f39e59b8b79d2",
   "offlinedays": [
   ],
   "uuid": "f851d6c6-2507-4c26-ab70-d7d9e7c6733d",
   "suspended": false,
   "ipaddress": "208.124.150.146",
   "paymentGateway": "psigate",
   "dateOfLastCashOut": "2011-09-02T16:14:01.405Z",
   "terminalId": 35,
   "storeId": "RT7",
   "merchantPassword": "",
   "merchantId": "psigate",
   "printers": [
       {
           "connection_name": "COUNTER",
           "connectionType": 1,
           "print_original": true,
           "print_duplicate": false,
           "activate_cutter": true,
           "print_UPCCode": true,
           "print_zero_item_price": false,
           "message": [
               "Thanks for shopping",
               "in our store",
               "Have a nice day",
               "!!!"
           ],
           "type": "Default",
           "enabled": false
       },
       {
           "connection_name": "KITCHEN",
           "connectionType": 1,
           "print_original": false,
           "print_duplicate": false,
           "activate_cutter": true,
           "print_UPCCode": false,
           "print_zero_item_price": false,
           "type": "Kitchen",
           "enabled": false
       }
   ],
   "receiptHeaders": [
       "recently",
       "installed",
       "terminal",
       "please",
       "edit"
   ],
   "departments": [
       {
           "description1": "Default",
           "description2": "Admin",
           "description3": "1",
           "image": ""
       },
       {
           "description1": "Default",
           "description2": "",
           "description3": "",
           "image": ""
       },
       {
           "description1": "Default",
           "description2": "",
           "description3": "",
           "image": ""
       },
       {
           "description1": "Default",
           "description2": "",
           "description3": "",
           "image": ""
       },
       {
           "description1": "Default",
           "description2": "",
           "description3": "",
           "image": ""
       }
   ],
   "scales": [
       {
           "description1": "Default",
           "description2": "",
           "description3": "",
           "scaleId": "1",
           "comport": "COM1",
           "manufacturer": "",
           "applyTax1": false,
           "applyTax2": false,
           "applyTax3": false,
           "price" : 0,
           "enabled": false
       },
       {
           "description1": "",
           "description2": "",
           "description3": "",
           "scaleId": "2",
           "comport": "COM1",
           "manufacturer": "",
           "applyTax1": false,
           "applyTax2": false,
           "applyTax3": false,
           "price" : 0,
           "enabled": false
       },
       {
           "description1": "",
           "description2": "",
           "description3": "",
           "scaleId": "3",
           "comport": "COM1",
           "manufacturer": "",
           "applyTax1": false,
           "applyTax2": false,
           "applyTax3": false,
           "price" : 0,
           "enabled": false
       }
   ],
   "menuButtonHeaders": [
       {
           "description1": "",
           "description2": "",
           "description3": "",
           "defaultImage": "/assets/menu-1.png",
           "menu_id": 1,
           "image": "",
           "color": ""
       },
       {
           "description1": "",
           "description2": "",
           "description3": "",
           "defaultImage": "/assets/menu-2.png",
           "menu_id": 2,
           "image": "",
           "color": ""
       },
       {
           "description1": "",
           "description2": "",
           "description3": "",
           "defaultImage": "/assets/menu-3.png",
           "menu_id": 3,
           "image": "",
           "color": ""
       },
       {
           "description1": "",
           "description2": "",
           "description3": "",
           "defaultImage": "/assets/menu-4.png",
           "menu_id": 4,
           "image": "",
           "color": ""
       }
   ],
   "menuButtons": [],
   "connectiontimeout": 5000,
   "cardserver": "localhost",
   "cardserverport": 3858,
   "cardterminalid": "402",
   "showMobQRedits": false,
   "creditPayment": true,
   "debitPayment": true,
   "mobilePayment": false,
   "serverport": 80,
   "serverhost": "http://192.168.1.254",
   "mobqredits": {
       "bonus_codes": [
       ],
       "convert_percentage": 0
   }
};
