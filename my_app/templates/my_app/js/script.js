
$(document).ready(function() {
    const API_URL = 'http://127.0.0.1:8000/api/classes/';

    // Load danh sách lớp học
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

    // Render danh sách lớp học
    function renderClasses(classes) {
        const tableBody = $('#classTableBody');
        tableBody.empty();
        
        classes.forEach(function(classItem) {
            tableBody.append(`
                <tr>
                    <td>${classItem.id}</td>
                    <td>${classItem.name}</td>
                    <td>${classItem.description || ''}</td>
                    <td>${classItem.total_sessions}</td>
                    <td>${formatDate(classItem.start_date)}</td>
                    <td>${formatDate(classItem.end_date)}</td>
                    <td><span class="badge bg-info">${classItem.level}</span></td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2 edit-class" data-id="${classItem.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm delete-class" data-id="${classItem.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }

    // Format date
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('vi-VN');
    }

    // Validate dates
    function validateDates(startDate, endDate) {
        return new Date(startDate) <= new Date(endDate);
    }

    // Thêm lớp học mới

    
    $('#addClassForm').on('submit', function(e) {
        e.preventDefault();
        
        const startDate = $('#start_date').val();
        const endDate = $('#end_date').val();

        if (!validateDates(startDate, endDate)) {
            showError('Ngày kết thúc phải sau ngày bắt đầu');
            return;
        }

        const classData = {
            name: $('#name').val(),
            description: $('#description').val(),
            total_sessions: $('#total_sessions').val(),
            start_date: startDate,
            end_date: endDate,
            level: $('#level').val()
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
                renderClasses([response.newClass]);
                loadClasses();
            },
            error: function(xhr, status, error) {
                showError('Không thể thêm lớp học');
            }
        });
    });

    // Xóa lớp học
    $(document).on('click', '.delete-class', function() {
        const id = $(this).data('id');
        if (confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
            $.ajax({
                url: `${API_URL}${id}/`,
                method: 'DELETE',
                success: function() {
                    showSuccess('Xóa lớp học thành công');
                    loadClasses();
                },
                error: function(xhr, status, error) {
                    showError('Không thể xóa lớp học');
                }
            });
        }
    });

    // Chỉnh sửa lớp học
    $(document).on('click', '.edit-class', function() {
        const id = $(this).data('id');
        
        $.ajax({
            url: `${API_URL}${id}/`,
            method: 'GET',
            success: function(classItem) {
                $('#editId').val(classItem.id);
                $('#editName').val(classItem.name);
                $('#editDescription').val(classItem.description);
                $('#editTotalSessions').val(classItem.total_sessions);
                $('#editStartDate').val(classItem.start_date);
                $('#editEndDate').val(classItem.end_date);
                $('#editLevel').val(classItem.level);
                $('#editClassModal').modal('show');
            },
            error: function(xhr, status, error) {
                showError('Không thể tải thông tin lớp học');
            }
        });
    });

    // Cập nhật lớp học
    $('#editClassForm').on('submit', function(e) {
        e.preventDefault();
        
        const startDate = $('#editStartDate').val();
        const endDate = $('#editEndDate').val();

        if (!validateDates(startDate, endDate)) {
            showError('Ngày kết thúc phải sau ngày bắt đầu');
            return;
        }

        const id = $('#editId').val();
        const classData = {
            name: $('#editName').val(),
            description: $('#editDescription').val(),
            total_sessions: $('#editTotalSessions').val(),
            start_date: startDate,
            end_date: endDate,
            level: $('#editLevel').val()
        };

        $.ajax({
            url: `${API_URL}${id}/`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(classData),
            success: function(response) {
                $('#editClassModal').modal('hide');
                showSuccess('Cập nhật lớp học thành công');
                loadClasses();
            },
            error: function(xhr, status, error) {
                showError('Không thể cập nhật lớp học');
            }
        });
    });

    // Tìm kiếm lớp học
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        $.ajax({
            url: API_URL,
            method: 'GET',
            success: function(data) {
                const filteredClasses = data.filter(classItem => 
                    classItem.name.toLowerCase().includes(searchTerm) ||
                    classItem.level.toLowerCase().includes(searchTerm)
                );
                renderClasses(filteredClasses);
            },
            error: function(xhr, status, error) {
                showError('Lỗi khi tìm kiếm lớp học');
            }
        });
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

    // Load classes khi trang được tải
    loadClasses();
});
   