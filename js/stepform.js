var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

// Helper functions to fade tabs in and out
var TRANSITION_MS = 300;
function fadeIn(el) {
  el.style.display = "block";
  el.style.opacity = 0;
  requestAnimationFrame(function () {
    el.style.opacity = 1;
  });
}

function fadeOut(el, cb) {
  el.style.opacity = 0;
  setTimeout(function () {
    el.style.display = "none";
    if (cb) cb();
  }, TRANSITION_MS);
}

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  fadeIn(x[n]);
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Fade out the current tab and show the next/previous one when done
  var oldTab = x[currentTab];
  fadeOut(oldTab, function () {
    currentTab = currentTab + n;
    if (currentTab >= x.length) {
      document.getElementById("regForm").submit();
      return false;
    }
    showTab(currentTab);
  });
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
  }

// ----------------------
// Swipe/drag navigation
// ----------------------
// Pointer events let the form respond to both touch swipes and mouse drags.
// Handlers are registered once and internal state determines whether a swipe
// should trigger navigation.
let startX = null;
let startY = null;
let dragging = false;
const swipeTarget = document.getElementById("regForm");

if (swipeTarget) {
  swipeTarget.addEventListener("pointerdown", function (e) {
    startX = e.clientX;
    startY = e.clientY;
    dragging = true;
  });

  swipeTarget.addEventListener("pointermove", function () {
    if (!dragging) return; // ignore moves when not dragging
  });

  swipeTarget.addEventListener("pointerup", function (e) {
    if (!dragging) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      if (deltaX < 0) {
        nextPrev(1);
      } else {
        nextPrev(-1);
      }
    }
    dragging = false;
    startX = null;
    startY = null;
  });
}
