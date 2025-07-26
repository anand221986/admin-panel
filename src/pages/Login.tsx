import LoginForm from "@/components/LoginForm";
const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="hidden lg:flex flex-col min-h-full p-12 justify-center space-y-4">
            <h1 className="text-4xl font-medium text-gray-800 leading-tight">
              Welcome to{" "}
              <p className="text-7xl">
                Xbees
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Hire
                </span>
              </p>
            </h1>
            <p className="text-gray-600 text-xl">
              Precision talent discovery for modern teams.
            </p>
          </div>

          <div className="w-full">
            <div className="lg:hidden mb-8"></div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
