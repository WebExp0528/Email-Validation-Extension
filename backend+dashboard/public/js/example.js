$("#domain-approved-table").Tabledit({
  url: "api/update-domain-list",
  columns: {
    identifier: [3, "_id"],
    editable: [[1, "domain"], [2, "status"]]
  },
  buttons: {
    edit: {
      class: "btn btn-sm btn-secondary",
      html: '<span class="fa fa-pencil-alt"></span>',
      action: "edit"
    },
    delete: {
      class: "btn btn-sm btn-secondary",
      html: '<span class="fa fa-trash"></span>',
      action: "delete"
    }
  },
  onDraw: function() {
    $("table tr td:nth-child(3) input").each(function() {
      addCheckbox($(this));
    });
  },
  onSuccess: function(data, textStatus, jqXHR) {
    // console.log("onSuccess(data, textStatus, jqXHR)");
    // console.log(data);
    // console.log(textStatus);
    // console.log(jqXHR);
    if (data.message == "Removed!") {
      removeRowDomainTable(data.id);
    }
  },
  onFail: function(jqXHR, textStatus, errorThrown) {
    console.log("onFail(jqXHR, textStatus, errorThrown)");
    console.log(jqXHR);
    console.log(textStatus);
    console.log(errorThrown);
  },
  onAlways: function() {
    console.log("onAlways()");
  },
  onAjax: function(action, serialize) {
    console.log("onAjax(action, serialize)");
    console.log(action);
    console.log(serialize);
  }
});

function addCheckbox(name) {
  $(name).prop("type", "checkbox");
  console.log(name);

  if ($(name).val() == "Approved") {
    $(name).prop("checked", "checked");
  } else {
    $(name).prop("checked", "");
    $(name).checked = false;
  }

  $(name).change(function() {
    $(this).val(this.checked ? "Approved" : "Blocked");
    $(this)
      .siblings("span")
      .text(this.checked);
  });
}

function removeRowDomainTable(id) {
  $(".number1").each(function(index, el) {
    console.log(index);
    $(el).html(parseInt(index) + 1);
  });
  $("input[value='" + id + "']")
    .parent()
    .parent()
    .remove();
}

const inputDomain = document.querySelector(".inputDomain");
inputDomain.addEventListener("input", changeInputDomain);

function changeInputDomain() {
  var term = this.value;
  var re = new RegExp(
    "^@[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\\.[a-zA-Z]{2,})+(?:,@[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\\.[a-zA-Z]{2,})+)*(?:,)*$"
  );
  if (re.test(term)) {
    this.classList.remove("is-invalid");
    $(".addDomain").prop("disabled", false);
  } else {
    if (!this.classList.contains("invalid-invalid"))
      this.classList.add("is-invalid");
    $(".addDomain").prop("disabled", true);
  }
}

function addDomain() {
  var domains = $(".inputDomain").val();
  var domainArr = domains.split(",");
  domainArr.forEach(function(el) {
    if (el) {
      $.post("api/register-domain", {
        domain: el
      })
        .done(function(data) {
          location.reload();
        })
        .fail(function(xhr, status, error) {
          $(".inputDomain").val("");
          $(".addDomain").prop("disabled", true);
        });
    }
  });
}

/**
 * Update Recent Search
 */
$("#recent-search-table").Tabledit({
  url: "api/recent-search-list",
  columns: {
    identifier: [3, "_id"],
    editable: [[1, "email"], [2, "expire"]]
  },
  buttons: {
    edit: {
      class: "btn btn-sm btn-secondary",
      html: '<span class="fa fa-pencil-alt"></span>',
      action: "edit"
    },
    delete: {
      class: "btn btn-sm btn-secondary",
      html: '<span class="fa fa-trash"></span>',
      action: "delete"
    }
  },
  onDraw: function() {
    $("table tr td:nth-child(3) input").each(function() {
      addDatePicker($(this));
    });
  },
  onSuccess: function(data, textStatus, jqXHR) {
    // console.log("onSuccess(data, textStatus, jqXHR)");
    // console.log(data);
    // console.log(textStatus);
    // console.log(jqXHR);
    if (data.message == "Removed!") {
      removeRowRecentSearch(data.id);
    }
  },
  onFail: function(jqXHR, textStatus, errorThrown) {
    console.log("onFail(jqXHR, textStatus, errorThrown)");
    console.log(jqXHR);
    console.log(textStatus);
    console.log(errorThrown);
  },
  onAlways: function() {
    console.log("onAlways()");
  },
  onAjax: function(action, serialize) {
    console.log("onAjax(action, serialize)");
    console.log(action);
    console.log(serialize);
  }
});

function addDatePicker(name) {}

function removeRowRecentSearch(id) {
  $(".number2").each(function(index, el) {
    console.log(index);
    $(el).html(parseInt(index) + 1);
  });
  $("input[value='" + id + "']")
    .parent()
    .parent()
    .remove();
}
const inputEmail = document.querySelector(".inputEmail");
inputEmail.addEventListener("input", changeInputEmail);

function changeInputEmail() {
  // var term = this.value;
  // var re = new RegExp(
  //   "^@[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\\.[a-zA-Z]{2,})+(?:,@[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\\.[a-zA-Z]{2,})+)*(?:,)*$"
  // );
  // if (re.test(term)) {
  //   this.classList.remove("is-invalid");
  //   $(".addDomain").prop("disabled", false);
  // } else {
  //   if (!this.classList.contains("invalid-invalid"))
  //     this.classList.add("is-invalid");
  //   $(".addDomain").prop("disabled", true);
  // }
}

function addEmail() {
  // var domains = $(".inputDomain").val();
  // var domainArr = domains.split(",");
  // domainArr.forEach(function(el) {
  //   if (el) {
  //     $.post("api/register-domain", {
  //       domain: el
  //     })
  //       .done(function(data) {
  //         location.reload();
  //       })
  //       .fail(function(xhr, status, error) {
  //         $(".inputDomain").val("");
  //         $(".addDomain").prop("disabled", true);
  //       });
  //   }
  // });
}
