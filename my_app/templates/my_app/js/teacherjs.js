
$(document).ready(function() {
 document.querySelector('.container').removeAttribute('aria-hidden');
    const API_URL = 'http://127.0.0.1:8000/api/teachers/';

    function loadTeachers() {
        $.ajax({
            url: API_URL,
            method: 'GET',
            success: function(data) {
                renderTeachers(data);
            },
            error: function(xhr, status, error) {
                showError('Không thể tải danh sách giáo viên');
            }
        });
    }
    // Tạo giáo viên mới
    $('#createTeacherForm').on('submit', function(e) {
        e.preventDefault();
        
        const teacherEData = {
            full_name: $('#full_name').val(),
            username: $('#username').val(),
            password: $('#password').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            role: $('#role').val()
        };
    
        $.ajax({
            url: API_URL,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(teacherEData),
            success: function(response) {
                $('#createTeacherModal').modal('hide');
                $('#createTeacherForm')[0].reset();
                showSuccess('Thêm giáo viên thành công');
                loadTeachers();
            },
            error: function(xhr, status, error) {
                const response = xhr.responseJSON;
                if (response.error) {
                    showError(response.error);  // Hiển thị lỗi từ API
                } else {
                    showError('Không thể thêm giáo viên');
                }
            }
        });
    });
    
    // Hàm để tải danh sách giáo viên
    function renderTeachers(teachers) {
        const tableBody = $('#teacherTableBody');
        tableBody.empty();
    
        // Kiểm tra nếu không có dữ liệu
        if (teachers.length === 0) {
            tableBody.append(`
                <tr>
                    <td colspan="7">Không có giáo viên nào.</td>
                </tr>
            `);
        } else {
            // Lặp qua danh sách giáo viên và hiển thị dữ liệu vào bảng
            teachers.forEach(function(teacher) {
                tableBody.append(`
                    <tr>
                        <td>${teacher.id}</td>
                        <td>${teacher.full_name}</td>
                        <td>${teacher.username}</td>
                        <td>${teacher.email}</td>
                        <td>${teacher.phone}</td>
                        <td>${teacher.role}</td>
                        <td>
                            <button class="btn btn-warning btn-sm me-2 edit-teacher" data-id="${teacher.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm delete-teacher" data-id="${teacher.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
        }
    }
    
    // Biến lưu id giáo viên cần xóa
    let teacherToDeleteId = null;

    // Khi nhấn nút xóa, hiển thị modal và lưu id giáo viên
    $(document).on('click', '.delete-teacher', function() {
        teacherToDeleteId = $(this).data('id');
        $('#deleteTeacherModal').modal('show');
    });

    // Xử lý khi người dùng xác nhận xóa
    $('#deleteTeacher').on('submit', function(e) {
        e.preventDefault();

        if (teacherToDeleteId) {
            $.ajax({
                url: `${API_URL}${teacherToDeleteId}/`,
                method: 'DELETE',
                success: function() {
                    $('#deleteTeacherModal').modal('hide');
                    showSuccess('Xóa giáo viên thành công');
                    loadTeachers();  // Reload danh sách giáo viên
                },
                error: function(xhr, status, error) {
                    showError('Không thể xóa giáo viên');
                }
            });
        }
    });
    // Chỉnh sửa thông tin người dùng
    $(document).on('click', '.edit-teacher', function() {
        const id = $(this).data('id');

        $.ajax({
            url: `${API_URL}${id}/`,
            method: 'GET',
            success: function(teacher) {
                $('#editId').val(teacher.id);
                $('#editUsername').val(teacher.username);
                $('#editFullName').val(teacher.full_name);
                $('#editEmail').val(teacher.email);
                $('#editPhone').val(teacher.phone);
                $('#editRole').val(teacher.role);
                $('#editTeacherModal').modal('show');
            },
            error: function(xhr, status, error) {
                showError('Không thể tải thông tin giáo viên');
            }
        });
    });

    // Cập nhật thông tin người dùng
    $('#editTeacherForm').on('submit', function(e) {
        e.preventDefault();
        
        const id = $('#editId').val();
        const teacherData = {
            username: $('editUsername').val(),
            full_name: $('#editFullName').val(),
            email: $('#editEmail').val(),
            phone: $('#editPhone').val(),
            role: $('#editRole').val()
        };

        $.ajax({
            url: `${API_URL}${id}/`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(teacherData),
            success: function(response) {
                $('#editTeacherModal').modal('hide');
                showSuccess('Cập nhật người dùng thành công');
                loadTeachers();  // Reload danh sách người dùng
            },
            error: function(xhr, status, error) {
                const response = xhr.responseJSON;
            if (response.error) {
                showError(response.error);  // Hiển thị lỗi từ API
            } else {
                showError('Không thể thêm giáo viên');
            }
            }
        });
    });
    // Tìm kiếm giáo viên
    $('#searchInput').on('keydown', function(event) {
        if (event.key === 'Enter' || event.which === 13) {  // Kiểm tra phím Enter
            event.preventDefault();  // Ngăn chặn hành vi mặc định của phím Enter (submit form)
    
            const searchTerm = $(this).val().toLowerCase();  // Lấy từ khóa tìm kiếm và chuyển về chữ thường
                // Nếu không có từ khóa tìm kiếm (ô tìm kiếm rỗng), tải lại tất cả giáo viên
            if (searchTerm === "") {
                loadTeachers();  // Gọi lại hàm loadTeachers để tải lại danh sách đầy đủ
            }else {
            $.ajax({
                url: API_URL,  // URL API để lấy danh sách giáo viên
                method: 'GET',
                success: function(data) {
                    // Lọc giáo viên dựa trên id, tên hoặc email, đảm bảo id là chuỗi
                    const filteredTeachers = data.filter(teacher => {
                        const teacherId = String(teacher.id);  // Chuyển teacher.id thành chuỗi
                        return (
                            teacherId.includes(searchTerm) ||  // Tìm kiếm theo ID
                            (teacher.full_name && teacher.full_name.toLowerCase().includes(searchTerm)) ||  // Tìm theo tên
                            (teacher.email && teacher.email.toLowerCase().includes(searchTerm))           // Tìm theo email
                        );
                    });
    
                    renderTeachers(filteredTeachers);  // Gọi hàm hiển thị kết quả tìm kiếm
                },
                error: function(xhr, status, error) {
                    showError('Lỗi khi tìm kiếm giáo viên');  // Hiển thị lỗi nếu không thể tìm kiếm
                }
            });
        }
        }
    });
    // Hiển thị thông báo
    function showError(message) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: message
        });
    }

    function showSuccess(message) {
        Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: message
        });
    }

    // Tải danh sách giáo viên khi trang được tải
    loadTeachers();
    // Reset form khi đóng modal (khi nhấn nút "x" hoặc "Đóng")
    $('#createTeacherModal').on('hidden.bs.modal', function () {
        $('#createTeacherForm')[0].reset();
    });
    $('#editTeacherModal').on('hidden.bs.modal', function () {
        $('#editTeacherForm')[0].reset();
    });
});
