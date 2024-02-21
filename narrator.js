/* global jsyaml, engine */
let story;
let inventory;
let counter1 =0;
let counter2 =0;
let counter3 =0;

fetch("story.yaml")
  .then(res => res.text())
  .then(start);

function start(storyText) {
  story = jsyaml.load(storyText);

  engine.setTitle(story["metadata"]["title"]);
  inventory = new Set(story["initially"]["inventory"]);


  //arrive("example_location", "Intro/transition text");
  arrive(story["initially"]["location"], story["initially"]["description"]);
}

function arrive(target, initialDescription) {
  // TODO: use `target` / `story` / `inventory` to update the display
  
  engine.clearDescriptions();
    
  engine.addDescription(initialDescription);
  
  let currentTarget = story['locations'][target];
  // let currentBackground = currentTarget['background'];
  // console.log(currentBackground);
  // engine.setBackground(currentBackground);
  
  console.log("old ");
  console.log(inventory);
  updateInventory(currentTarget)
  console.log("new ");
  console.log( inventory);
  let currentTargetDescription = currentTarget['descriptions'];  
  
  currentTargetDescription.forEach(description => {
    if (conditionsHold(description)) {
      engine.addDescription(description.text, description.tags);
      
    }
  }); 
  let currentTargetChoices = currentTarget['choices'];
  engine.clearChoices(); 
  currentTargetChoices.forEach(choiceText =>{ 
    if (conditionsHold(choiceText)){
      
    engine.addChoice(choiceText.text, () => {
      arrive(choiceText.target, choiceText.narration);
  }, [choiceText.tags]/*tags*/);
    
  }})

}


// function compare( arr1, arr2 ) {
//   return arr1.length == arr2.length && 
//          arr1.every( function(arr1_i,i) { return arr1_i == arr2[i] } )  
//   }  


function all(arrR, setT) {
  let arrSet = new Set(arrR);
    for (let a of arrSet){
      if (!setT.has(a)) {
              return false;
      }

    };
    return true;
}


function conditionsHold(obj) {
  // TODO: return false if obj.with contains any item not in inventory
  // TODO: return false if obj.with contains any time that *is* in inventory
  
  let withArray = obj['with'];
  let withoutArray = obj['without'];
  console.log(obj);  
  let results = true;
  
  inventory.forEach(inventoryElement =>{
    if (typeof withArray !== 'undefined'){
      console.log("with Array "+ all(withArray, inventory));
      if(!all(withArray, inventory)){
        //counter1 += 1;
        //console.log("withArray "+ counter1);
        results  = false;
      }
    }
   if (typeof withoutArray !== 'undefined'){
      console.log("withoutArray "+ all(withoutArray, inventory));
      if(all(withoutArray,inventory)){
        results  = false;
      }
   }
  });
  counter3 += 1;
  console.log("Results "+ results);
  return results;
  }



// function conditionsHold(obj) {
//   // TODO: return false if obj.with contains any item not in inventory
//   // TODO: return false if obj.with contains any time that *is* in inventory
  
//   let withArray = obj['with'];
//   let withoutArray = obj['without'];
//   console.log(obj);  
//   let results = true;
  
//   inventory.forEach(inventoryElement =>{
//     if (typeof withArray !== 'undefined'){
//       withArray.forEach(withArrayElement=> {
//         if (!withArrayElement.includes(inventoryElement)){
//         //counter1 += 1;
//         //console.log("withArray "+ counter1);
//         results  = false;
//       }
//       } );
//     }
//    if (typeof withoutArray !== 'undefined'){
//       withoutArray.forEach(withoutArrayElement=> {
//         if (withoutArrayElement.includes(inventoryElement)){
//         //counter2 += 1;
//         //console.log("withoutArray "+ counter2);
//         results  = false;
//       }
        
//       });
//     }
//   });
//   counter3 += 1;
//   console.log("Results "+ results);
//   return results;
//   }



  
function updateInventory(modify){
  let modifyProvides = modify['provides'];
  let modifyConsume = modify['consumes'];
  if (typeof modifyProvides !== 'undefined'){
    modifyProvides.forEach(inventory.add, inventory)
  }
  if (typeof modifyConsume !== 'undefined'){
    modifyConsume.forEach(inventory.delete, inventory)
  } 
} 



