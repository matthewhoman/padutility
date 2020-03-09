//Algorithms: Find the Symmetric Difference

function sym(...args) {
    if(args.length === 0) {
      return [];
    }
  
    return recursiveSym(args.shift(), args, []);
  }
  
  function recursiveSym(arr1, allSets, symSet) {
    if(allSets.length === 0) {
      return arr1;
    }
    let arr2 = allSets.shift();

    for(let no of arr1) {
      if(!arr2.includes(no) && !symSet.includes(no)) {
        symSet.push(no)
      } 
    }
  
    for(let no of arr2) {
      if(!arr1.includes(no) && !symSet.includes(no)) {
        symSet.push(no)
      } 
    }
  
    return recursiveSym(symSet, allSets, []);
  }
  
  //console.log("result " + sym([1, 2, 5], [2, 3, 5], [3, 4, 5]))
  //sym([1, 2, 3], [5, 2, 1, 4]);



  //Algorithms: No Repeats Please

  function permAlone(str) {
    return permRecursive(str).length;
  }
  
  function permRecursive(str) {
    var results = [];
  
    if (str.length === 1) {
      results.push(str);
      return results;
    }
  
    for (var i = 0; i < str.length; i++) {
      var firstChar = str[i];
      var charsLeft = str.substring(0, i) + str.substring(i + 1);
      var innerPermutations = permRecursive(charsLeft);
      for (var j = 0; j < innerPermutations.length; j++) {
        if(firstChar !== innerPermutations[j].charAt(0)) {
          results.push(firstChar + innerPermutations[j]);
        }
      }
    }
    return results;
  }
  
  permAlone('aab')
  console.log("**** " + permAlone('aab'));


  //Indices sum
  function pairwise(arr, sumNo) {
    let indicesSum = 0;
    let indexUsedRight = [];
    let indexUsedLeft = [];
    for (var i = 0; i < arr.length; i++) {
      if(i + 2 === arr.length) {
        return indicesSum;
      }
      for (var j = i + 1; j < arr.length; j++) {
        if (((arr[i] + arr[j]) === sumNo) && !indexUsedRight.includes(j)
            && !indexUsedLeft.includes(i)) {
          indicesSum += j + i;
          indexUsedRight.push(j);
          indexUsedLeft.push(i);
          break;
        }
      }
    }
    return indicesSum;
  }
  
  console.log(pairwise([1, 1, 1], 2))
  //console.log(pairwise([0, 0, 0, 0, 1, 1], 1))
  pairwise([1, 1, 1], 2);


  //bubble sort

  function bubbleSort(items) {
    var length = items.length;
    items.forEach((item, i) => {
      for (var j = 0; j < (length - i - 1); j++) { 
        //Compare the adjacent positions
        if (items[j] > items[j + 1]) {
          //Swap the numbers
          var tmp = items[j]; 
          items[j] = items[j + 1]; 
          items[j + 1] = tmp; 
        }
      }
    })
    return items;
  }
  
  console.log(bubbleSort([1, 4, 2, 8, 345, 123, 43, 32, 5643, 63, 123, 43, 2, 55, 1, 234, 92]))


  //selection sort
  function selectionSort(arr) {
    let len = arr.length;
      for (let i = 0; i < len; i++) {
          let min = i;
          for (let j = i + 1; j < len; j++) {
              if (arr[min] > arr[j]) {
                  min = j;
              }
          }
          if (min !== i) {
              let tmp = arr[i];
              arr[i] = arr[min];
              arr[min] = tmp;
          }
      }
      return arr;
  }
  
  console.log(selectionSort([1, 4, 2, 8, 345, 123, 43, 32, 5643, 63, 123, 43, 2, 55, 1, 234, 92]))
  
  selectionSort([1, 4, 2, 8, 345, 123, 43, 32, 5643, 63, 123, 43, 2, 55, 1, 234, 92]);
  

  //Insertion sort
  function insertionSort(array) {
    for (let i = 1; i < array.length; i++) {
      let j = i - 1
      let tmp = array[i]
      while (j >= 0 && array[j] > tmp) {
        array[j + 1] = array[j]
        j--
      }
      array[j+1] = tmp
    }
    return array
  }
  
  insertionSort([1, 4, 2, 8, 345, 123, 43, 32, 5643, 63, 123, 43, 2, 55, 1, 234, 92]);
  
  //quick sort
  function quickSort(array) {
    if (array.length <= 1) {
           return array;
           } else {
                 var leftArr = [];              
                 var rightArr = [];
                 var newArr = [];
                 var pivot = array.pop();  
                 var length = array.length;
                 for (var i = 0; i < length; i++) {
                    if (array[i] <= pivot) { 
                       leftArr.push(array[i]);      
                 } else {
                         rightArr.push(array[i]);
               }
             }
           return newArr.concat(quickSort(leftArr), pivot, quickSort(rightArr)); 
        }
  }



  //merge sort

  function mergeSort(arr) {
    if (arr.length < 2) {
      return arr;
    }
  
    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);
  
    return merge(mergeSort(left), mergeSort(right));
  }
  
  function merge(left, right) {
    let arr = [];
  
    while (left.length && right.length) {
      if (left[0] < right[0]) {
        arr.push(left.shift());
      } else {
        arr.push(right.shift());
      }
    }
    return arr.concat(left.slice().concat(right.slice()));
  }
  
  mergeSort([1, 4, 2, 8, 345, 123, 43, 32, 5643, 63, 123, 43, 2, 55, 1, 234, 92]);
  