// Table properties
const theadRow = document.getElementById("table-heading-row");
const tbody = document.getElementById("table-body");

// constants
const columns = 26;
const rows = 100;

//style buttons
const boldButton = document.getElementById('bold-btn');
const italicsButton = document.getElementById('italics-btn');
const underlineButton = document.getElementById('underline-btn');
// align buttons
const leftAlign = document.getElementById('left-align');
const centerAlign = document.getElementById('center-align');
const rightAlign = document.getElementById('right-align');


// Dropdown
const fontSizeDropDown = document.getElementById('font-size');
const fontFamilyDropDown = document.getElementById('font-family');

// cut-copy/ paste button
const cutButton = document.getElementById('cut-button');
const copyButton = document.getElementById('copy-button');
const pasteButton = document.getElementById('paste-button');

// color input
const bgColorInput= document.getElementById('bgColor');
const textColorInput = document.getElementById('textColor');
const uploadJsonFile = document.getElementById('jsonFile');

// Add sheet button
const addSheetButton = document.getElementById('add-sheet-btn');
const sheetNumHeading = document.getElementById('sheet-num');

// clipboard
let currentCell;
let cutCell = {};


// forming OuterArray
let matrix = new Array(rows);
for (let row = 0; row < rows; row++) {
  // adding innerArrays
  matrix[row] = new Array(columns);
  for (col = 0; col < columns; col++) {
    // fixing innerArrays to empty objects
    matrix[row][col] = {};
  }
}

// things related to multiple sheets
let numSheets = 1; // number of sheets
let currSheetNum = 1; // currentSheet

// updateMatrix will take currentCell
function updateMatrix(currentCell){
  let obj = {
    style: currentCell.style.cssText,
    text: currentCell.innerText,
    id: currentCell.id,
  }

  let id= currentCell.id.split('');

  let i=id[1]-1;
  let j=id[0].charCodeAt(0)-65; 
//   document.getElementById(`${i+1}`).style.backgroundColor="black";
//   document.getElementById(`${id[0]}`).style.backgroundColor="black";
  matrix[i][j]=obj;
}

for (let col = 0; col < columns; col++) {
    let th = document.createElement('th');
    th.innerText= String.fromCharCode(col+65);
    th.id=String.fromCharCode(col+65);
    theadRow.append(th);
}

for(let row=1;row<=rows;row++){
    // I create TR;
    let tr=document.createElement('tr');
    // table heading
    let th=document.createElement('th');

    th.innerText = row;
    th.className="sr-no";
    th.id=`${row}`;
    tr.append(th);
    // looping from A to Z;
    for(let col=0;col<columns;col++){
        let td= document.createElement('td');
        td.setAttribute('contenteditable','true');
        td.setAttribute('id',`${String.fromCharCode(col+65)}${row}`)
        td.addEventListener('input',(event)=>onInputFn(event));
        // this event listener will triger when any cell comes in focus;
        td.addEventListener('focus',(event)=> onFocusFn(event));
        td.addEventListener('focusout',(event)=>onFocusOut(event));
        tr.append(td);
    }
    tbody.append(tr);
}

function onFocusOut(event){
    currentCell=event.target;

    let id= currentCell.id;

    //match method to extract number
  let i=id.match(/\d+/g)-1;

  let j=id[0].charCodeAt(0)-65; 
   document.getElementById(`${i+1}`).style.backgroundColor="rgb(239,239,239)";
   document.getElementById(`${id[0]}`).style.backgroundColor="rgb(239,239,239)";
}

function onInputFn(event){
  updateMatrix(event.target);
}

// BOLD BUTTON
boldButton.addEventListener("click", () => {
  if (currentCell.style.fontWeight === "bold") {
    currentCell.style.fontWeight = "normal";
  } else currentCell.style.fontWeight = "bold";

  updateMatrix(currentCell);
});

// ITALICS
italicsButton.addEventListener('click',()=>{
    if(currentCell.style.fontStyle === 'italic'){
        currentCell.style.fontStyle = 'normal';
    }
    else currentCell.style.fontStyle = 'italic';
    updateMatrix(currentCell);
})

// underline
underlineButton.addEventListener("click", () => {
  if (currentCell.style.textDecoration === "underline") {
    currentCell.style.textDecoration = "none";
  } else currentCell.style.textDecoration = "underline";
  updateMatrix(currentCell);
});

// Left align button
leftAlign.addEventListener('click',()=>{
    currentCell.style.textAlign='left';
    updateMatrix(currentCell);

})
// Center align button
centerAlign.addEventListener('click',()=>{
    currentCell.style.textAlign='center';
    updateMatrix(currentCell);
})
// Right align button
rightAlign.addEventListener('click',()=>{
    currentCell.style.textAlign='right';
    updateMatrix(currentCell); // O(1)
})
// font Size
fontSizeDropDown.addEventListener('change',()=>{
    currentCell.style.fontSize=fontSizeDropDown.value;
    updateMatrix(currentCell);
})
// Font Family
fontFamilyDropDown.addEventListener('change',()=>{
    currentCell.style.fontFamily=fontFamilyDropDown.value;
    updateMatrix(currentCell);
})

cutButton.addEventListener("click", () => {
  cutCell = {
    style: currentCell.style.cssText,
    text: currentCell.innerText,
  };
  currentCell.innerText = "";
  currentCell.style = null;
  updateMatrix(currentCell);
  // console.log(matrix);
});

copyButton.addEventListener("click", () => {
  cutCell = {
    style: currentCell.style.cssText,
    text: currentCell.innerText,
  };
});

pasteButton.addEventListener("click", () => {
  if (cutCell.text) {
    currentCell.style = cutCell.style;
    currentCell.innerText = cutCell.text;
    updateMatrix(currentCell);
  }
});

// using input
bgColorInput.addEventListener("input", () => {
  currentCell.style.backgroundColor = bgColorInput.value;
  updateMatrix(currentCell);
});

// using change
textColorInput.addEventListener('input',()=>{
  currentCell.style.color = textColorInput.value;
  updateMatrix(currentCell);
});


function onFocusFn(event){
    currentCell=event.target;
    document.getElementById('current-cell').innerText=currentCell.id;

    let id= currentCell.id;

  let i=id.match(/\d+/g)-1;
  let j=id[0].charCodeAt(0)-65; 
  document.getElementById(`${i+1}`).style.backgroundColor="grey";
  document.getElementById(`${id[0]}`).style.backgroundColor="grey";
}

function downloadJson(){
  // I am converting this matrix to string
  const matrixString = JSON.stringify(matrix);

  // converting text form of matrix to downloadable form(file)
  const blob = new Blob([matrixString],{type:'application/json'});

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  // naming the file which will be downloaded;
  link.download = 'table.json'; // data.json is name of file
  // I add this link in my DOM to make it clickable
  document.body.appendChild(link);
  link.click();
  // remove link
  document.body.removeChild(link);
}

uploadJsonFile.addEventListener('change',readJSONfileFn);

function readJSONfileFn(event){
  const file = event.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(e){
      // reader has read the file and converted it into
      // code
      // fileContent is in string
      const fileContent = e.target.result;
      try{
        const fileContentJSON = JSON.parse(fileContent);
        matrix=fileContentJSON;

        // iterating over matrix and saving it in my html table
        fileContentJSON.forEach((row)=>{
          row.forEach((cell)=>{
            // cell is reflection object of my currentCell
            // in matrix
            if(cell.id){
              // respecting currentCell of cell 
              // in html or table
              var currentCell = document.getElementById(cell.id);
              currentCell.innerText=cell.text;
              currentCell.style.cssText=cell.style;
            }
          })
        })
      }
      catch(err){
        console.log('error in reading json file',err);
      }
    };
  }
}

addSheetButton.addEventListener('click',()=>{
  // 
  // we clearing we are saving
  if(numSheets===1){
    var tempArr = [matrix]; // virtual memory of my matrix
    localStorage.setItem('arrMatrix',JSON.stringify(tempArr));
  } else{
    var previousSheetArr = JSON.parse(localStorage.getItem('arrMatrix'));
    var updatedArr = [...previousSheetArr,matrix];
    localStorage.setItem('arrMatrix',JSON.stringify(updatedArr));
  }
  // update variable related to my sheet
  numSheets++;
  currSheetNum=numSheets;

  // cleanup my virtual memory
  for(let row=0;row<rows;row++){
    matrix[row]=new Array(columns);
    for(let col=0;col<columns;col++){
      matrix[row][col]={};
    }
  }

// table body will be none for my new sheet;
  tbody.innerHTML=``;
  for(let row=1;row<=rows;row++){
    let tr = document.createElement('tr');
    let th=document.createElement('th');
    th.innerText=row;
    tr.append(th);
    // looping from A to Z
    for (let col = 0; col < columns; col++) {
      let td=document.createElement('td');
      td.setAttribute("contenteditable", "true");
      td.setAttribute('id',`${String.fromCharCode(col+65)}${row}`);
      td.addEventListener('focus',(event)=>onFocusFn(event));
      td.addEventListener('input',(event)=>onInputFn(event));
      tr.append(td);
    }
    tbody.append(tr);
  }
  sheetNumHeading.innerText="Sheet No. " + currSheetNum;
})

document.getElementById("sheet-1").addEventListener("click", () => {
  var myArr = JSON.parse(localStorage.getItem("arrMatrix"));
  let tableData = myArr[0]; // matrix;
  currSheetNum = 1;
  matrix = tableData; // my matrix maintain currentTableData
  tableData.forEach((row) => {
    row.forEach((cell) => {
      if (cell.id) {
        var mycell = document.getElementById(cell.id);
        mycell.innerText = cell.text;
        mycell.style.cssText = cell.style;
      }
    });
  });
  sheetNumHeading.innerText="Sheet No. "+currSheetNum;
});

document.getElementById("sheet-2").addEventListener("click", () => {
  var myArr = JSON.parse(localStorage.getItem("arrMatrix"));
  let tableData = myArr[1]; // matrix;
  matrix = tableData; // my matrix maintain currentTableData
  currSheetNum = 2;
  tableData.forEach((row) => {
    row.forEach((cell) => {
      if (cell.id) {
        var mycell = document.getElementById(cell.id);
        mycell.innerText = cell.text;
        mycell.style.cssText = cell.style;
      }
    });
  });
  sheetNumHeading.innerText="Sheet No. "+currSheetNum;
});

document.getElementById("sheet-3").addEventListener("click", () => {
  var myArr = JSON.parse(localStorage.getItem("arrMatrix"));
  let tableData = myArr[2]; // matrix;
  currSheetNum = 3;
  matrix = tableData; // my matrix maintain currentTableData
  tableData.forEach((row) => {
    row.forEach((cell) => {
      if (cell.id) {
        var mycell = document.getElementById(cell.id);
        mycell.innerText = cell.text;
        mycell.style.cssText = cell.style;
      }
    });
  });
  sheetNumHeading.innerText="Sheet No. "+currSheetNum;
});

