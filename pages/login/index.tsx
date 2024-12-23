import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctUsername = "user";
    const correctPassword = "123456";
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjo0ODgxNDgyMTI5LCJpYXQiOjE3Mjc4ODIxMjksImp0aSI6IjgxNzIyYjdjOTkzNDRmODE4NTQ2YzgzNjE3MWQ2ZTQ4IiwidXNlcl9pZCI6Mn0.vl-N1lP4q8R3bKO9mX8OsGsp5T5_GNGmtSB1SkLitg8";

    if (username === correctUsername && password === correctPassword) {
      localStorage.setItem("authToken", token);
      router.push("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">Login</h1>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <form onSubmit={handleLogin} className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-input mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-500 focus:outline-none"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
