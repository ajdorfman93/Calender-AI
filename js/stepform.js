var currentTab = 0; // Current tab is set to be the first tab (0)

document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll("#regForm input");
  inputs.forEach((inp) => {
    const cached = localStorage.getItem(inp.name);
    if (cached) inp.value = cached;
    inp.addEventListener("input", () => {
      localStorage.setItem(inp.name, inp.value);
    });
  });
  showTab(currentTab); // Display the current tab
  compileSummary();
});

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  x[n].style.opacity = 0;
  // Trigger a fade-in effect
  requestAnimationFrame(function () {
    x[n].style.opacity = 1;
  });
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
    compileSummary();
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
  // Hide the current tab with a fade-out effect
  var oldTab = currentTab;
  x[oldTab].style.opacity = 0;
  setTimeout(function () {
    x[oldTab].style.display = "none";
  }, 300);
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab after fade-out completes:
  setTimeout(function () {
    showTab(currentTab);
  }, 300);
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

function compileSummary() {
  const fname = document.querySelector("input[name='fname']").value;
  const lname = document.querySelector("input[name='lname']").value;
  const email = document.querySelector("input[name='email']").value;
  const phone = document.querySelector("input[name='phone']").value;
  const dd = document.querySelector("input[name='dd']").value;
  const mm = document.querySelector("input[name='nn']").value;
  const yyyy = document.querySelector("input[name='yyyy']").value;
  const uname = document.querySelector("input[name='uname']").value;

  const summary =
    `Name:\n${fname} ${lname}` +
    `\nContact Info:\n${email}\n${phone}` +
    `\nBirthday:\n${dd}/${mm}/${yyyy}` +
    `\nUsername:\n${uname}`;
  const summaryEl = document.getElementById("summary");
  if (summaryEl) summaryEl.textContent = summary;
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
    // Don't start a swipe when interacting with form inputs
    if (e.target.closest("input, textarea")) {
      dragging = false;
      startX = null;
      startY = null;
      return;
    }
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
