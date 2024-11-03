$(document).ready(function() {
    document.querySelector('.container').removeAttribute('aria-hidden');
    const API_URL = 'http://127.0.0.1:8000/api/classes/';
   
    function loadClasses() {
        $.ajax({
            url: API_URL,
            method: 'GET',
            success: function(data) {
                renderClasses(data);
            },
            error: function(xhr, status, error) {
                showError('Không thể tải danh sách lớp học');
            }
        });
    }

    // Tạo lớp học mới
    $('#addClassForm').on('submit', function(e) {
        e.preventDefault();
           
        const classData = {
            full_name: $('#name').val(),
            username: $('#description').val(),
            password: $('#total_sessions').val(),
            email: $('#start_date').val(),
            phone: $('#end_date').val(),
            role: $('#level').val()
        };
       
        $.ajax({
            url: API_URL,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(classData),
            success: function(response) {
                $('#addClassModal').modal('hide');
                $('#addClassForm')[0].reset();
                showSuccess('Thêm lớp học thành công');
                loadClasses();  // Đổi từ loadClass thành loadClasses
            },
            error: function(xhr, status, error) {
                const response = xhr.responseJSON;
                if (response.error) {
                    showError(response.error);
                } else {
                    showError('Không thể thêm lớp học');
                }
            }
        });
    });

    // Hàm để hiển thị danh sách lớp học
    function renderClasses(classes) {
        const tableBody = $('#classTableBody');
        tableBody.empty();

        if (classes.length === 0) {
            tableBody.append(`
                <tr>
                    <td colspan="7">Không có lớp nào.</td>
                </tr>
            `);
        } else {
            classes.forEach(function(c) {
                tableBody.append(`
                    <tr>
                        <td>${c.id}</td>
                        <td>${c.name}</td>
                        <td>${c.description}</td>
                        <td>${c.total_sessions}</td>
                        <td>${c.start_date}</td>
                        <td>${c.end_date}</td>
                        <td><span class="badge bg-info">${c.level}</span></td>
                        <td>
                            <button class="btn btn-warning btn-sm me-2 edit-class" data-id="${c.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm delete-class" data-id="${c.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
        }
    }

    // Xử lý xóa lớp học
    let classToDeleteId = null;

    $(document).on('click', '.delete-class', function() {
        classToDeleteId = $(this).data('id');
        $('#deleteClassModal').modal('show');
    });

    $('#deleteClassForm').on('submit', function(e) {
        e.preventDefault();

        if (classToDeleteId) {
            console.log(`Xóa lớp học với ID: ${classToDeleteId}`); 
            $.ajax({
                url: `${API_URL}${classToDeleteId}/`,
                method: 'DELETE',
                success: function() {
                    $('#deleteClassModal').modal('hide');
                    showSuccess('Xóa lớp học thành công');
                    loadClasses();  // Đổi từ loadTeachers thành loadClasses
                },
                error: function(xhr, status, error) {
                    showError('Không thể xóa lớp học');
                }
            });
        }
    });

    // Chỉnh sửa thông tin lớp học
    $(document).on('click', '.edit-class', function() {
        const id = $(this).data('id');

        $.ajax({
            url: `${API_URL}${id}/`,
            method: 'GET',
            success: function(classData) {
                $('#editId').val(classData.id);
                $('#editUsername').val(classData.username);
                $('#editFullName').val(classData.full_name);
                $('#editEmail').val(classData.email);
                $('#editPhone').val(classData.phone);
                $('#editRole').val(classData.role);
                $('#editClassModal').modal('show');
            },
            error: function(xhr, status, error) {
                showError('Không thể tải thông tin lớp học');
            }
        });
    });

    // Cập nhật thông tin lớp học
    $('#editClassForm').on('submit', function(e) {
        e.preventDefault();
           
        const id = $('#editId').val();
        const classData = {
            username: $('#editUsername').val(),
            full_name: $('#editFullName').val(),
            email: $('#editEmail').val(),
            phone: $('#editPhone').val(),
            role: $('#editRole').val()
        };

        $.ajax({
            url: `${API_URL}${id}/`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(classData),
            success: function(response) {
                $('#editClassModal').modal('hide');
                showSuccess('Cập nhật lớp học thành công');
                loadClasses();  // Đổi từ loadTeachers thành loadClasses
            },
            error: function(xhr, status, error) {
                const response = xhr.responseJSON;
                if (response.error) {
                    showError(response.error);
                } else {
                    showError('Không thể cập nhật lớp học');
                }
            }
        });
    });

    // Tìm kiếm lớp học
    $('#searchInput').on('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();

            const searchTerm = $(this).val().toLowerCase();

            if (searchTerm === "") {
                loadClasses();  // Gọi lại hàm loadClasses để tải lại danh sách đầy đủ
            } else {
                $.ajax({
                    url: API_URL,
                    method: 'GET',
                    success: function(data) {
                        const filteredClasses = data.filter(classData => {
                            const classId = String(classData.id);
                            return (
                                classId.includes(searchTerm) || 
                                (classData.full_name && classData.full_name.toLowerCase().includes(searchTerm)) ||
                                (classData.email && classData.email.toLowerCase().includes(searchTerm))
                            );
                        });

                        renderClasses(filteredClasses);
                    },
                    error: function(xhr, status, error) {
                        showError('Lỗi khi tìm kiếm lớp học');
                    }
                });
            }
        }
    });

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

    // Tải danh sách lớp học khi trang được tải
    loadClasses();

    // Reset form khi đóng modal
    $('#createClassModal').on('hidden.bs.modal', function() {
        $('#createClassForm')[0].reset();
    });
    $('#editClassModal').on('hidden.bs.modal', function() {
        $('#editClassForm')[0].reset();
    });
});
