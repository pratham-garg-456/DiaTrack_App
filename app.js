/*********************************************************************************  
*  WEB322 – Assignment 1  
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.    
*  No part of this assignment has been copied manually or electronically from any other source  
*  (including web sites) or distributed to other students.  
*   
*  Name: _Ankit Thapar_____________________ Student ID: __125698217____________ Date: _3 November 2022_______________ 

********************************************************************************/

const mongoUrl = "mongodb+srv://senecaathapar:seneca8847@cluster0.6kvn1rd.mongodb.net/diabetes_First_Nation_Health_Hackathon?retryWrites=true&w=majority";

const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const PatientSchema = mongoose.Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    Phone: { type: String, required: true },
    Medication: { type: String, required: true },
    SugarLevels: { type: String, required: true },
    Age: { type: Number, required: true }, 
    BMI: {type:Number , required: true}, 
    Insulin: {type:Number , required: true}


})


const PatientsInfo = mongoose.model("PatientInformation", PatientSchema)

const csvtojson = require('csvtojson')

const app = express()

mongoose.connect(mongoUrl).then(() => {     // MongoDB connection
    console.log('database connected')
});




app.use(express.static('public'))    // static folder
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')             // set the template engine

app.listen(3000, () => {
    console.log('server started at port 3000')
})

var excelStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/excelUploads');      // file added to the public folder of the root directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
var excelUploads = multer({ storage: excelStorage });


app.get('/', (req, res) => {
    res.render('index.ejs');
})
app.get('/about.ejs', (req, res) => {
    res.render('about.ejs');
})

app.get('/services.ejs', (req, res) => {
    res.render('services.ejs');
})

app.get('/blog.ejs', (req, res) => {
    res.render('blog.ejs');
})

app.get('/contact.ejs', (req, res) => {
    res.render('contact.ejs');
})

app.get('/doctor.ejs', (req, res) => {
    res.render('doctor.ejs');
})
app.get('/searchemail.ejs', (req, res) => {
    res.render('searchemail.ejs');
})

app.get('/uploadExcel', (req, res) => {
    res.render('uploadExcel.ejs');
})

// upload excel file and import in mongodb
app.post('/uploadExcelFile', excelUploads.single("uploadfile"), (req, res) => {
    importFile('./public' + '/excelUploads/' + req.file.filename);
    function importFile(filePath) {
        //  Read Excel File to Json Data
        var arrayToInsert = [];
        csvtojson().fromFile(filePath).then(source => {
            // Fetching the all data from each row
            console.log(source.length)
            for (var i = 0; i < source.length; i++) {
                console.log(source[i]["name"])
                var singleRow = {
                    Name: source[i]["Name"],
                    Email: source[i]["Email"],
                    Phone: source[i]["Phone"],
                    Medication: source[i]["Medication"],
                    SugarLevels: source[i]["Glucose"],
                    Age: source[i]["Age"],
                    BMI: source[i]["BMI"] , 
                    Insulin: source[i]["Insulin"]
                };
                arrayToInsert.push(singleRow);
            }
            //inserting into the table student
            PatientsInfo.insertMany(arrayToInsert, (err, result) => {
                if (err) console.log(err);
                if (result) {
                    console.log("File imported successfully.");
                    res.redirect('/')
                }
            });
        });
    }
})


/*
PatientsInfo.findById("64547414ee1fefe0f6ecc281",(error,bookFound)=>{
    if(error){
        // Error in reading the book.
        console.log(error)
    }else{
        // Successfuly found the book object. Printing the book to the console.
        console.log("*** FIND BY ID ***")
        console.log(bookFound)
        console.log("************")
        console.log("")
    }

})
*/

// Checking to see if a particular medication works or not
/*
PatientsInfo.find({Medication: "Metformin"},(error, all_patients)=>{
    if(error){
        console.log("Error")
    }else{
        total_patients = 0
        patients_worked = 0
        patients_not_worked = 0
        for (var i = 0; i < all_patients.length ; i++){
            sugar_levels = all_patients[i].SugarLevels.split(",")
            initial_blood_sugar = Number(sugar_levels[0].split(" ")[1])
            // Calculating the sugar levels after the first medication
            sum_blood_sugar = 0
            for(var i2 = 1 ; i2 < sugar_levels.length ; i2++){
                blood_sugar = Number(sugar_levels[i2].split(" ")[1])
                sum_blood_sugar += blood_sugar

            } ; 
            
            if (sum_blood_sugar != 0){
                // Patient has recieved atleast one dose
                avg_blood_sugar = sum_blood_sugar/(sugar_levels.length - 1)
                if (avg_blood_sugar <= initial_blood_sugar - 10){
                    patients_worked += 1
                }else{
                    patients_not_worked += 1
                } ;
                total_patients += 1
            } ; 

        } ; 
        
        percentage_worked = ((patients_worked/total_patients) * 100).toFixed(2)
        percentage_not_worked = ((patients_not_worked/total_patients) * 100).toFixed(2)
        
        
    }
})
*/

// Displaying the trend of a particular patient by email
/*
PatientsInfo.findOne({Email:"emilysmith@gmail.com"},(error, patient)=>{
    if(error){
        console.log("Error")
    }else{
        sugar_levels = patient.SugarLevels.split(",")
        Dates = []
        Sugar_Levels = []
        for(var i = 0; i < sugar_levels.length ; i++){
            Dates.push(sugar_levels[i].split(" ")[0])
            Sugar_Levels.push(sugar_levels[i].split(" ")[1])
        }

        console.log(Dates)
        console.log(Sugar_Levels)
    }
})
*/


app.get('/medication', function (req, res) {

    PatientsInfo.find({ Medication: "Metformin" }, (error, all_patients) => {
        if (error) {
            console.log("Error")
        } else {
            total_patients = 0
            patients_worked = 0
            patients_not_worked = 0
            for (var i = 0; i < all_patients.length; i++) {
                sugar_levels = all_patients[i].SugarLevels.split(",")
                initial_blood_sugar = Number(sugar_levels[0].split(" ")[1])
                // Calculating the sugar levels after the first medication
                sum_blood_sugar = 0
                for (var i2 = 1; i2 < sugar_levels.length; i2++) {
                    blood_sugar = Number(sugar_levels[i2].split(" ")[1])
                    sum_blood_sugar += blood_sugar

                };

                if (sum_blood_sugar != 0) {
                    // Patient has recieved atleast one dose
                    avg_blood_sugar = sum_blood_sugar / (sugar_levels.length - 1)
                    if (avg_blood_sugar <= initial_blood_sugar - 10) {
                        patients_worked += 1
                    } else {
                        patients_not_worked += 1
                    };
                    total_patients += 1
                };

            };

            percentage_worked = ((patients_worked / total_patients) * 100).toFixed(2)
            percentage_not_worked = ((patients_not_worked / total_patients) * 100).toFixed(2)
            res.render('chart.ejs', { no_w: patients_worked, no_nw: patients_not_worked, per_s: percentage_worked, per_ns: percentage_not_worked, medication: "Metformin" })

        }
    })



});




app.get('/age', function (req, res) {
    PatientsInfo.find({}, (error, all_patients) => {
        if (error) {
            console.log("Error")
        } else {
            p_0_14 = 0
            p_15_24 = 0
            p_25_64 = 0
            p_65_a = 0
            for (var i = 0; i < all_patients.length; i++) {
                if (all_patients[i].Age >= 0 && all_patients[i].Age <= 14) {
                    p_0_14 += 1
                } else if (all_patients[i].Age >= 15 && all_patients[i].Age <= 24) {
                    p_15_24 += 1

                } else if (all_patients[i].Age >= 25 && all_patients[i].Age <= 64) {
                    p_25_64 += 1

                } else {
                    // 65 and above
                    p_65_a += 1
                }

            }

            res.render('age.ejs', { p0_14: p_0_14, p15_24: p_15_24, p25_64: p_25_64, p65_a: p_65_a })
        }

    })

});



// search by email
app.post("/email", (req, res) => {

    let msg = ''
    const { email } = req.body

    PatientsInfo.findOne({ Email: email }, (error, patient) => {
        if (error) {
            console.log("Error")
        } else {
            res.render('otp.ejs', { email: email })
        }
    })


})

// OTP

app.post("/otp", (req, res) => {

    let msg = ''
    const { email, otp } = req.body

    PatientsInfo.findOne({ Email: email }, (error, patient) => {
        if (error) {
            console.log("Error")
        } else {
            sugar_levels = patient.SugarLevels.split(",")
            Dates = []
            Sugar_Levels = []
            for (var i = 0; i < sugar_levels.length; i++) {
                Dates.push(sugar_levels[i].split(" ")[0])
                Sugar_Levels.push(sugar_levels[i].split(" ")[1])
            }
            res.render('singlep.ejs', { dates: Dates, sugar_level: Sugar_Levels, name: patient.Name })
        }
    })


})



