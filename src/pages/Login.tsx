import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Acessar o Sistema</h1>
      <div className="flex gap-4">
        <button
          onClick={() => login("admin")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Entrar como Admin
        </button>
        <button
          onClick={() => login("professor")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Entrar como Professor
        </button>
        <button
          onClick={() => login("aluno")}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Entrar como Aluno
        </button>
      </div>
    </div>
  );
}

export default LoginPage;