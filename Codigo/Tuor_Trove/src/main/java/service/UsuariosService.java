package service;

import java.util.List;

import com.google.gson.Gson;

import dao.UsuariosDAO;
import model.Usuario;
import security.MD5;
import spark.Request;
import spark.Response;

public class UsuariosService {
    private UsuariosDAO usuariosDAO;

    public UsuariosService() {
        usuariosDAO = new UsuariosDAO();
        usuariosDAO.conectar();  
    }

    // Método para adicionar um novo usuário
    public Object add(Request request, Response response) throws Exception {
        Usuario usuario = new Gson().fromJson(request.body(), Usuario.class);
        
        if (usuariosDAO.inserirUsuario(usuario)) {
            response.status(201); 
            response.type("application/json");
            return new Gson().toJson("Usuário cadastrado com sucesso.");
        } else {
            response.status(500); 
            response.type("application/json");
            return new Gson().toJson("Erro ao cadastrar o usuário.");
        }
    }

    // Método para listar todos os usuários
    public Object getAll(Request request, Response response) {
        List<Usuario> usuariosList = usuariosDAO.getAllUsuarios();
        
        if (usuariosList != null && !usuariosList.isEmpty()) {
            response.status(200); 
            response.type("application/json"); 
            return new Gson().toJson(usuariosList); 
        } else {
            response.status(404); 
            response.type("application/json");
            return new Gson().toJson("Nenhum usuário encontrado.");
        }
    }

    // Método para login de usuário
    public Object login(Request request, Response response) throws Exception {
        Usuario usuario = new Gson().fromJson(request.body(), Usuario.class);
        Usuario usuarioBanco = usuariosDAO.getUsuarioByEmail(usuario.getEmail());
        usuario.setSenha(MD5.Hash(usuario.getSenha()));
        if (usuarioBanco != null && usuarioBanco.getSenha().equals(usuario.getSenha())) {
            // Login bem-sucedido, retorna dados do usuário (sem a senha)
            usuarioBanco.setSenha(null); // Remover a senha antes de enviar
            response.status(200);
            response.type("application/json");
            return new Gson().toJson(usuarioBanco);
        } else {
            response.status(401);
            response.type("application/json");
            return new Gson().toJson("Email ou senha incorretos.");
        }
    }
    
    // Método para atualizar um usuário
    public Object update(Request request, Response response) {
        try {
            int id = Integer.parseInt(request.params(":id")); // Obtém o ID do usuário a partir da URL
            Usuario usuarioAtualizado = new Gson().fromJson(request.body(), Usuario.class);
            usuarioAtualizado.setId(id); // Define o ID do usuário atualizado

            if (usuariosDAO.atualizarUsuario(usuarioAtualizado)) {
                response.status(200);
                return new Gson().toJson("Usuário atualizado com sucesso.");
            } else {
                response.status(404);
                return new Gson().toJson("Usuário não encontrado.");
            }
        } catch (Exception e) {
            response.status(400);
            return new Gson().toJson("Erro ao atualizar usuário: " + e.getMessage());
        }
    }

    
    // Método para remover um usuário
    public Object delete(Request request, Response response) {
        int id = Integer.parseInt(request.params(":id"));

        if (usuariosDAO.removerUsuario(id)) {
            response.status(200);
            response.type("application/json");
            return new Gson().toJson("Usuário removido com sucesso.");
        } else {
            response.status(500);
            response.type("application/json");
            return new Gson().toJson("Erro ao remover o usuário.");
        }
    }
}