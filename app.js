const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

const uri = 'mongodb+srv://admin-tebogo:test123@cluster0.ixvpl.mongodb.net/todolistDB?retryWrites=true&w=majority';

mongoose.connect(uri , {useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item ({
    name: "EJS"
});

const item2 = new Item ({
    name: "Push to Git"
});

const item3 = new Item ({
    name: "Start MongoDB"
});

const defaultItems = [item1, item2, item3];

app.get('/', (req, res) => {

    let home = '/';

    let today = new Date().toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        day: '2-digit'
    });
    
    Item.find({}, function(err, items){

        if (items.length === 0) {
            Item.insertMany(defaultItems, function(err, items){
                if (err) throw err;
            
                console.log("Successfully saved!");
            });
            res.redirect('/');
        } 
        res.render('index', {dayOfWeek: today, addItem: items, path: home});
    });

});


app.post('/', (req, res) => {

    let item = req.body.addItem;

    let newItem = new Item ({
        name: item
    });

    Item.create(newItem);

    res.redirect('/');

});

app.post('/delete', (req, res) => {

    const targetItem = req.body.checked;

    Item.deleteOne({name: targetItem}, err => {
        if (err) throw err;

        console.log("Item successfully deleted");
    });

    res.redirect('/');
    
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, () => {
    console.log(`Now running on port ${port}`);
});
