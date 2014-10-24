// getting all the items
// var itemList = [];
// var priceList = [];
// var itemQuant =[];

var tableitems="";  // gets all the items in the table and then outputs them

Items = new Meteor.Collection("items"); 
// Prices = new Meteor.Collection("prices");
// Qunatities = new Meteor.Collection("quant"); 



if (Meteor.isClient) {

var mealswipeapi = "https://spreadsheets.google.com/feeds/list/18ocdFFouu4iPCGUiMHOPaodcFqshuzMyAc7SBwPYoj8/od6/public/values?alt=json";
var datasheet = jQuery.getJSON(mealswipeapi, function(json){
      console.log("It's working!");


      for (var i = 0; i <= json.feed.entry.length - 1; i++) {
        // itemList.push(json.feed.entry[i].gsx$item.$t);//adds elements in item column to itemList
        // priceList.push(json.feed.entry[i].gsx$price.$t);//adds elements in price column to priceList
        // itemQuant.push(0);
        if (Items.findOne({name:json.feed.entry[i].gsx$item.$t}) == null)//preventing duplicates
          Items.insert({id: (i+1).toString() , name: json.feed.entry[i].gsx$item.$t, price: json.feed.entry[i].gsx$price.$t, floatPrice: parseFloat(json.feed.entry[i].gsx$price.$t.substring(1,json.feed.entry[i].gsx$price.$t.length)) ,quant: 0 });

      };
      // console.log(itemList);
      // console.log(priceList);
      // Session.set("listLength", itemList.length);
      // i might want to do session/set instead of 2 global variables in the future.
    });

var responded =datasheet.done(function() {
    console.log( "done retrieving data" );

    //OLD Method of Printing out the table, doesn't use much meteor code
// Session.set("listLength", itemList.length);

//collection printing code 
// var count=1;
// var sortedItems = Items.find({});
// sortedItems.forEach(function(item) {

//     tableitems= tableitems.concat("<tr><td>",item.name,"</td>");
//     tableitems= tableitems.concat("<td>",item.price,"</td>");
//     tableitems=tableitems.concat("<td>", item.quant, "{{quant}}</td>")
//     tableitems= tableitems.concat("<td><button type = 'button'; class= 'btn btn-default btn-sm inc'; id= '"+count+"'> +</button><button type = 'button'; class= 'btn btn-default btn-sm dec'> -</button></td></tr>");
//     console.log(count + ". Name:"+item.name+" Price: "+ item.price+ " Quantity: " + item.quant)
//     count ++;

//   }
// // use session.get here
// )
// // console.log(Session.get("listLength"));


// // tableitems= tableitems.concat("</tbody>");

// jQuery(".items").html(tableitems)

  });

//json parsing section end


  Template.table.items = function () {
    return Items.find({});
  };

  Template.table.selected_name = function () {
    var item = Items.findOne(Session.get("selected_item"));
    return item && item.name;
  };


Template.table.events({
  'click button.inc': function (event){//plus buttons
    // console.log("+ button pressed");
    Items.update({_id:Items.findOne({id:event.target.id})['_id']}, {$inc:{quant: 1}});// add 1 to quant

  },

    'click button.dec': function (event){//minus buttons
    // console.log("- button pressed");
    if ({_quant:Items.findOne({id:event.target.id})['quant']}._quant>=1){//make sure it doesn't go negative
    Items.update({_id:Items.findOne({id:event.target.id})['_id']}, {$inc:{quant: -1}});// add -1 to quant
    }

  }

})
// TOTALS section

// Alot of the code here is copy pasted and repeated, Note to self: clean it up later, find way to integrate it all
Template.total.sum = function(){
var sum = 0.00; //total cost of all the items
Items.find({}).forEach(function(item) {
  sum = sum + item.floatPrice *item.quant;
  })
  return sum.toFixed(2);
};

Template.total.credit = function(){
var credit = 8.00;//meal swipe credit
var sum = 0.00; //total cost of all the items
Items.find({}).forEach(function(item) {
  sum = sum + item.floatPrice *item.quant;
  })
return (credit - sum).toFixed(2) ;
}

Template.total.active = function(){
  var credit = 8.00;//meal swipe credit
  var sum = 0.00; //total cost of all the items
  Items.find({}).forEach(function(item) {
    sum = sum + item.floatPrice *item.quant;
    })

  if (credit-sum >=0)
    return 'success'
  else
    return 'danger'
}
//End Totals Section

// Template.table.update_items = function(){

// // Session.setDefault("listLength", 0);
//    // tableitems=tableitems.concat("<tr><td>","test","</td>","<td>","25","</td></tr>")
//   // var htmlTable = document.createElement('td');
//   // htmlTable.innerHTML = tableitems

// //TEMP COMMENTED
//   // for (var i = 0; i < Session.get("listLength"); i++) {
    
//   //   tableitems= tableitems.concat("<tr><td>",itemList[i],"</td>");
//   //   tableitems= tableitems.concat("<td>",priceList[i],"</td>");
//   //   tableitems=tableitems.concat("<td>", itemQuant[i], "</td>")
//   //   tableitems= tableitems.concat("<td><button type = 'button'; class= 'btn btn-default btn-sm'; id = 'increment'> +</button><button type = 'button'; class= 'btn btn-default btn-sm'; > -</button></td></tr>");
//   // }
//   //   tableitems= tableitems.concat("</tbody>");

//   // //   htmlTable = jQuery.parseHTML(tableitems);
//   // //   console.log(htmlTable);
//   //   jQuery(".items").html(tableitems)

//   // return tableitems;
// }

// Template.table.helpers=({
// })

// Template.hello.greeting = function() {
//     return "Welcome to MealSwipe.";
//   };


//   Template.hello.events({
//     'click input': function () {
//       // template data, if any, is available in 'this'
//       if (typeof console !== 'undefined')
//         console.log("You pressed the button");
//       console.log(datasheet);
//       console.log(responded);


//        // console.log(parsed_datasheet.feed.entry);// this is a string, need to parse it
//     }
//   });
}

if (Meteor.isServer) {

  Meteor.startup(function () {
    Items.remove({});//removes old items left behind in cache

    // code to run on server at startup
  });
}

