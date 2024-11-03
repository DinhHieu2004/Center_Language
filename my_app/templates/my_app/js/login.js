$("#loginForm").submit(function(event) {
    event.preventDefault(); // Ngăn chặn form gửi dữ liệu mặc định

    const username = $("#username").val();
    const password = $("#password").val();
    const errorMsg = $("#errorMsg");

    // Gửi yêu cầu POST tới API đăng nhập
    $.ajax({
        url: 'http://127.0.0.1:8000/login/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            username: username,
            password: password
            
        }),
        success: function(data) {
            if (data.success) {
                alert("Đăng nhập thành công!");
                // Điều hướng theo quyền của người dùng
                if (data.role === 'admin') {
                    window.location.href = "Class.html";
                } else if (data.role === 'teacher') {
                    window.location.href = "Teachers.html";
                }
            } else {
                errorMsg.text("Tên đăng nhập hoặc mật khẩu không chính xác");
            }
        },
        error: function() {
            errorMsg.text("Có lỗi xảy ra khi kết nối với server.");
        }
    });
});
