import { useState } from "react";
import { useAuthProvider } from "@/context/useAuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Login() {
  const { login } = useAuthProvider();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await login({ email, senha });
    } catch (err) {
      setError("Credenciais inválidas. Verifique e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "rgb(250, 250, 250)" }}
    >
      <Card
        className="w-full max-w-md shadow-lg border"
        style={{
          backgroundColor: "white",
          borderColor: "rgb(209, 218, 235)",
        }}
      >
        <CardHeader>
          <CardTitle
            className="text-center text-2xl font-semibold"
            style={{ color: "rgb(8, 36, 66)" }}
          >
            Studium — Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium"
                style={{ color: "rgb(8, 36, 66)" }}
              >
                E-mail Institucional
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="exemplo@studium.edu.br"
                onChange={(e) => setEmail(e.target.value)}
                className="focus-visible:ring-[rgb(16,70,132)]"
              />
            </div>

            <div>
              <label
                htmlFor="senha"
                className="block mb-1 text-sm font-medium"
                style={{ color: "rgb(8, 36, 66)" }}
              >
                Senha
              </label>
              <Input
                id="senha"
                type="password"
                value={senha}
                placeholder="••••••••"
                onChange={(e) => setSenha(e.target.value)}
                className="focus-visible:ring-[rgb(16,70,132)]"
              />
            </div>

            {error && (
              <p
                className="text-sm text-center font-medium"
                style={{ color: "rgb(217, 38, 38)" }}
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-semibold text-white transition-colors"
              style={{
                backgroundColor: "rgb(16, 70, 132)",
              }}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : null}
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <a
              href="#"
              className="hover:underline"
              style={{ color: "rgb(16, 70, 132)" }}
            >
              Esqueceu sua senha?
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
