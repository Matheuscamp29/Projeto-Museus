package app;

import static spark.Spark.*;
import service.MuseusService;
import service.UsuariosService;
import service.ExposicaoService;

public class Aplicacao {

    private static MuseusService museusService = new MuseusService();
    private static UsuariosService usuariosService = new UsuariosService();
    private static ExposicaoService exposicaoService = new ExposicaoService();

    public static void main(String[] args) {
        // Porta
        port(6790);

        staticFiles.location("/public");

        // Rotas para museus
        post("/museu", (request, response) -> museusService.add(request, response));
       get("/museu", (request, response) -> {
            response.type("application/json");
            return museusService.getAll(request, response);
        });
        delete("/museu/:id", (request, response) -> museusService.delete(request, response));
        put("/museu/:id", (request, response) -> museusService.update(request, response));
        get("/museu/:id", (request, response) -> museusService.getById(request, response));


        // Rotas para usuários
        post("/usuario", (request, response) -> usuariosService.add(request, response));
        post("/usuario/login", (request, response) -> usuariosService.login(request, response));
        get("/usuario", (request, response) -> {
            response.type("application/json");
            return usuariosService.getAll(request, response);
        });
        put("/usuario/:id", (request, response) -> usuariosService.update(request, response));


        // Rotas para exposições
        put("/exposicao/:id", (request, response) -> exposicaoService.update(request, response));

        post("/exposicao", (request, response) -> exposicaoService.add(request, response));
        get("/exposicao", (request, response) -> {
            response.type("application/json");
            return exposicaoService.getAll(request, response);
        });
        get("/exposicao/museu/:id_museu", (request, response) -> {
            response.type("application/json");
            return exposicaoService.getByMuseuId(request, response);
        });
        delete("/exposicao/:id", (request, response) -> {
            return exposicaoService.delete(request, response);
        });
        // Rota para obter exposição pelo nome (usando parâmetro de consulta)
        get("/exposicao/nome", (request, response) -> {
            response.type("application/json");
            return exposicaoService.getByNome(request, response);
        });
        //bloquear endponit sensivel
        before("/usuario", (request, response) -> {
            String userAgent = request.userAgent();
            String customHeader = request.headers("X-Custom-Header");

            if (userAgent != null && userAgent.contains("Mozilla") && (customHeader == null || !customHeader.equals("frontend"))) {
                halt(403, "Acesso negado.");
            }
        });


    }
}