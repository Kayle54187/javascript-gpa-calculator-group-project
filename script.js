document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const assignmentNameInput = document.getElementById("assignment-name");
  const assignmentGradeInput = document.getElementById("assignment-grade");
  const addButton = document.getElementById("add-btn");
  const gpaValueElement = document.getElementById("gpa-value");
  const gpaMessageElement = document.getElementById("gpa-message");
  const assignmentsListElement = document.getElementById("assignments-list");

  // Data storage
  let assignments = JSON.parse(localStorage.getItem("assignments")) || [];

  // Initialize the app
  function initApp() {
    renderAssignments();
    calculateGPA();
  }

  // Add assignment
  function addAssignment() {
    const name = assignmentNameInput.value.trim();
    const grade = parseFloat(assignmentGradeInput.value);

    // Validation
    if (!name) {
      alert("Please enter an assignment name");
      return;
    }

    if (isNaN(grade)) {
      alert("Please enter a valid grade");
      return;
    }

    if (grade < 0 || grade > 5) {
      alert("Grade must be between 0 and 5");
      return;
    }

    // Create assignment object
    const assignment = {
      id: Date.now(),
      name,
      grade,
    };

    // Add to array and update storage
    assignments.push(assignment);
    localStorage.setItem("assignments", JSON.stringify(assignments));

    // Clear inputs
    assignmentNameInput.value = "";
    assignmentGradeInput.value = "";

    // Update UI
    renderAssignments();
    calculateGPA();
  }

  // Calculate GPA
  function calculateGPA() {
    if (assignments.length === 0) {
      gpaValueElement.textContent = "0.0";
      gpaMessageElement.textContent = "Add assignments to calculate GPA";
      gpaValueElement.classList.remove("pulse");
      return;
    }

    const total = assignments.reduce(
      (sum, assignment) => sum + assignment.grade,
      0,
    );
    const gpa = total / assignments.length;
    const roundedGPA = gpa.toFixed(2);

    gpaValueElement.textContent = roundedGPA;
    gpaValueElement.classList.add("pulse");

    // Add feedback message
    if (gpa >= 4.5) {
      gpaMessageElement.textContent = "Excellent work!";
      gpaMessageElement.style.color = "#27ae60";
    } else if (gpa >= 3.5) {
      gpaMessageElement.textContent = "Great job!";
      gpaMessageElement.style.color = "#2980b9";
    } else if (gpa >= 2.5) {
      gpaMessageElement.textContent = "Good effort";
      gpaMessageElement.style.color = "#f39c12";
    } else {
      gpaMessageElement.textContent = "Keep improving";
      gpaMessageElement.style.color = "#e74c3c";
    }

    // Remove pulse animation after it completes
    setTimeout(() => {
      gpaValueElement.classList.remove("pulse");
    }, 1500);
  }

  // Render assignments
  function renderAssignments() {
    if (assignments.length === 0) {
      assignmentsListElement.innerHTML =
        '<div class="empty-state">No assignments added yet</div>';
      return;
    }

    assignmentsListElement.innerHTML = "";

    assignments.forEach((assignment) => {
      const assignmentElement = document.createElement("div");
      assignmentElement.className = "assignment-item";

      // Determine grade indicator
      let gradeClass = "";
      if (assignment.grade >= 4.5) gradeClass = "grade-A";
      else if (assignment.grade >= 3.5) gradeClass = "grade-B";
      else if (assignment.grade >= 2.5) gradeClass = "grade-C";
      else if (assignment.grade >= 1.5) gradeClass = "grade-D";
      else gradeClass = "grade-F";

      assignmentElement.innerHTML = `
                <div class="assignment-info">
                    <span class="grade-indicator ${gradeClass}"></span>
                    <span class="assignment-name">${assignment.name}</span>
                </div>
                <div class="assignment-grade">${assignment.grade.toFixed(2)}</div>
            `;

      assignmentsListElement.appendChild(assignmentElement);
    });
  }

  // Log data to console
  function logDataToConsole() {
    console.log("--- GPA Calculator Data ---");
    console.log("Assignments:", assignments);

    if (assignments.length > 0) {
      const total = assignments.reduce((sum, a) => sum + a.grade, 0);
      const gpa = total / assignments.length;
      console.log(`GPA: ${gpa.toFixed(2)}`);
    } else {
      console.log("No assignments to calculate GPA");
    }

    console.log("--- End of Data ---");
  }

  // Event Listeners
  addButton.addEventListener("click", addAssignment);

  assignmentGradeInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addAssignment();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "s" || e.key === "S") {
      logDataToConsole();
      // Visual feedback
      document.body.style.backgroundColor = "#2c3e50";
      setTimeout(() => {
        document.body.style.backgroundColor = "";
      }, 200);
    }
  });

  // Initialize the app
  initApp();
});
