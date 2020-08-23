const api = "http://localhost:2020";

// Populate employee table
const populate = (callback) => {
  $.get(api + "/employees", data => {
    $("#tableBody").find("tr").remove();
    $.each(data, (i, v) => {
      let row = `
    <tr>
      <td>${v.empId}</td>
      <td>${v.empName}</td>
      <td>${v.empCity}</td>
      <td>
      <button class="btn btn-sm btn-info text-white font-weight-bold m-1 rounded updateEmpBtn" empId=${v.empId}>Update</button>
      <button class="btn btn-sm btn-danger text-white font-weight-bold m-1 rounded deleteEmpBtn" empId=${v.empId}>Delete</button>
      </td>
    </tr>
    `;
      $("#tableBody").append(row);
    });
    callback();
  });
};

// Handles section and nav link fade animation
const handleFade = (navBtnId, divId) => {
  $("#addEmployee").hide();
  $("#updateEmployee").hide();
  let active;

  $(navBtnId).click(function () {
    $(divId).fadeToggle(150, () => {
      active = $(divId).css("display");
      active == "none"
        ? $(this).removeClass("active")
        : $(this).addClass("active");
    });
  });
};

// Handles click event
const handleClick = () => {
  $(".updateEmpBtn").click(function () {
    console.log("Update");
    let empData = {
      empId: $(this).attr("empId"),
      empName: $("#updatedEmpName").val(),
      empCity: $("#updatedEmpCity").val(),
    };
    // updateEmployee()
    console.log(empData);

  });
  $(".deleteEmpBtn").click(function () {
    console.log("Delete");
  });
};

// Add new employee
const addEmployee = () => {
  let empData = {
    empName: $("#empName").val(),
    empCity: $("#empCity").val(),
  };
  $.post(api + `/employees`, empData, (data, status) => {
    if (status == "success") {
      $("#empName").val("");
      $("#empCity").val("");
      console.log(data);
    }
  });
};

// Updates employee info
const updateEmployee = (empId, empData) => {
  $.post(api + `/employees/${empId}`, empData, (data, status) => {
    if (status == "success") {
      $("#empName").val("");
      $("#empCity").val("");
      console.log(data);
    }
  });
};

const handleSubmit = () => {
  $("#addEmpBtn").click(() => {
    addEmployee();
  });
};

const init = () => {
  populate(handleClick);
  handleSubmit();
  handleFade("#getAllEmp", "#table");
  handleFade("#addEmp", "#addEmployee");
};

$(document).ready(() => {
  init();
});
