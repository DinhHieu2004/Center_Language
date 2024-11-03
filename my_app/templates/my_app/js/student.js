$(document).ready(function () {
  const API_URL = "http://127.0.0.1:8000/api/students/";

  // Load danh sách học viên
  function loadStudents() {
    $.ajax({
      url: API_URL,
      method: "GET",
      success: function (data) {
        renderStudents(data);
      },
      error: function (xhr, status, error) {
        showError("Không thể tải danh sách học viên");
      },
    });
  }

  // Render danh sách học viên
  function renderStudents(students) {
    const tableBody = $("#studentTableBody");
    tableBody.empty();

    students.forEach(function (student) {
      tableBody.append(`
                <tr>
                    <td>${student.id}</td>
                    <td>${student.full_name}</td>
                    <td>${student.email}</td>
                    <td>${student.phone}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2 edit-student" data-id="${student.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm delete-student" data-id="${student.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
    });
  }

  // Thêm học viên mới
  $("#addStudentForm").on("submit", function (e) {
    e.preventDefault();

    const studentData = {
      name: $("#add_full_name").val(),
      email: $("#add_email").val(),
      phone: $("#add_phone").val(),
    };

    $.ajax({
      url: API_URL,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(studentData),
      success: function (response) {
        $("#addStudentModal").modal("hide");
        $("#addStudentForm")[0].reset();
        showSuccess("Thêm học viên thành công");
        loadStudents();
      },
      error: function (xhr, status, error) {
        showError("Không thể thêm học viên");
      },
    });
  });

  // Xóa học viên
  $(document).on("click", ".delete-student", function () {
    const id = $(this).data("id");
    if (confirm("Bạn có chắc chắn muốn xóa học viên này?")) {
      $.ajax({
        url: `${API_URL}${id}/`,
        method: "DELETE",
        success: function () {
          showSuccess("Xóa học viên thành công");
          loadStudents();
        },
        error: function (xhr, status, error) {
          showError("Không thể xóa học viên");
        },
      });
    }
  });

  // Chỉnh sửa học viên
  $(document).on("click", ".edit-student", function () {
    const id = $(this).data("id");

    $.ajax({
      url: `${API_URL}${id}/`,
      method: "GET",
      success: function (student) {
        $("#editId").val(student.id);
        $("#editName").val(student.full_name);
        $("#editEmail").val(student.email);
        $("#editPhone").val(student.phone);
        $("#editStudentModal").modal("show");
      },
      error: function (xhr, status, error) {
        showError("Không thể tải thông tin học viên");
      },
    });
  });

  // Cập nhật học viên
  $("#editStudentForm").on("submit", function (e) {
    e.preventDefault();

    const id = $("#editId").val();
    const studentData = {
      name: $("#editName").val(),
      email: $("#editEmail").val(),
      phone: $("#editPhone").val(),
    };

    $.ajax({
      url: `${API_URL}${id}/`,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify(studentData),
      success: function (response) {
        $("#editStudentModal").modal("hide");
        showSuccess("Cập nhật học viên thành công");
        loadStudents();
      },
      error: function (xhr, status, error) {
        showError("Không thể cập nhật học viên");
      },
    });
  });

  // Tìm kiếm học viên
  $("#searchInput").on("input", function () {
    const searchTerm = $(this).val().toLowerCase();

    $.ajax({
      url: API_URL,
      method: "GET",
      success: function (data) {
        const filteredStudents = data.filter(
          (student) =>
            student.name.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm)
        );
        renderStudents(filteredStudents);
      },
      error: function (xhr, status, error) {
        showError("Lỗi khi tìm kiếm học viên");
      },
    });
  });

  // Hiển thị thông báo
  function showError(message) {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: message,
    });
  }

  function showSuccess(message) {
    Swal.fire({
      icon: "success",
      title: "Thành công",
      text: message,
    });
  }

  // Load students khi trang được tải
  loadStudents();
});
