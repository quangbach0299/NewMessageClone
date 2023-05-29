import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: ["/users/:path*", "/conversations/:path*"],
};

// cấu hình này cho phép áp dụng xác thực trước khi truy cập vào các trang bắt đầu bằng "/users/" trong ứng dụng Next.js. Nếu người dùng chưa xác thực, họ sẽ được chuyển hướng đến trang đăng nhập.
