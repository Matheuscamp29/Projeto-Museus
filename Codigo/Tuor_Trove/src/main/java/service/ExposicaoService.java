package service;

import java.util.List;
import com.google.gson.Gson;
import dao.ExposicaoDAO;
import model.Exposicao;
import spark.Request;
import spark.Response;

public class ExposicaoService {
    private ExposicaoDAO exposicaoDAO;

    public ExposicaoService() {
        exposicaoDAO = new ExposicaoDAO();
        exposicaoDAO.conectar();  
    }

    public Object add(Request request, Response response) {
        Exposicao exposicao = new Gson().fromJson(request.body(), Exposicao.class);

        if (exposicaoDAO.inserirExposicao(exposicao)) {
            response.status(201); 
            response.type("application/json");
            return new Gson().toJson("Exposição cadastrada com sucesso.");
        } else {
            response.status(500); 
            response.type("application/json");
            return new Gson().toJson("Erro ao cadastrar a exposição.");
        }
    }

    public Object getByNome(Request request, Response response) {
        String nomeExposicao = request.queryParams("nome");
        System.out.println("Nome da Exposição Recebido: " + nomeExposicao);
        Exposicao exposicao = exposicaoDAO.getExposicaoByNome(nomeExposicao);
    
        if (exposicao != null) {
            response.status(200);
            response.type("application/json");
            return new Gson().toJson(exposicao);
        } else {
            response.status(404);
            return "Exposição não encontrada.";
        }
    }
    
    

    public Object getAll(Request request, Response response) {
        List<Exposicao> exposicoesList = exposicaoDAO.getAllExposicoes();
        
        if (exposicoesList != null && !exposicoesList.isEmpty()) {
            response.status(200); 
            response.type("application/json"); 
            return new Gson().toJson(exposicoesList); 
        } else {
            response.status(404); 
            response.type("application/json");
            return new Gson().toJson("Nenhuma exposição encontrada.");
        }
    }

    public Object getByMuseuId(Request request, Response response) {
        int id_museu = Integer.parseInt(request.params(":id_museu"));
        List<Exposicao> exposicoesList = exposicaoDAO.getExposicoesByMuseuId(id_museu);
        
        if (exposicoesList != null && !exposicoesList.isEmpty()) {
            response.status(200); 
            response.type("application/json"); 
            return new Gson().toJson(exposicoesList); 
        } else {
            response.status(404); 
            response.type("application/json");
            return new Gson().toJson("Nenhuma exposição encontrada para este museu.");
        }
    }
    
    // Atualizar exposição por ID
    public Object update(Request request, Response response) {
        try {
            // Extrai o ID da URL e define na nova instância da exposição
            int id = Integer.parseInt(request.params(":id"));
            Exposicao novaExposicao = new Gson().fromJson(request.body(), Exposicao.class);
            novaExposicao.setId(id); // Define o ID correto na exposição a ser atualizada
            
            // Chama o DAO para atualizar a exposição com o ID atribuído
            if (exposicaoDAO.atualizarExposicao(novaExposicao)) {
                response.status(200);
                return new Gson().toJson("Exposição atualizada com sucesso.");
            } else {
                response.status(404);
                return new Gson().toJson("Exposição não encontrada.");
            }
        } catch (Exception e) {
            response.status(400);
            return new Gson().toJson("Erro ao atualizar a exposição: " + e.getMessage());
        }
    }


    // Remover exposição por ID
    public Object delete(Request request, Response response) {
        try {
            int id = Integer.parseInt(request.params(":id"));

            if (exposicaoDAO.removerExposicao(id)) {
                response.status(200);
                return new Gson().toJson("Exposição removida com sucesso.");
            } else {
                response.status(404);
                return new Gson().toJson("Exposição não encontrada.");
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return new Gson().toJson("ID da exposição inválido.");
        }
    }
}