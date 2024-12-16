package service;

import java.util.List;

import com.google.gson.Gson;

import dao.MuseusDAO;
import model.Museus;
import spark.Request;
import spark.Response;

public class MuseusService {
    private MuseusDAO museusDAO;

    public MuseusService() {
        museusDAO = new MuseusDAO();
        museusDAO.conectar();  
    }

    public Object add(Request request, Response response) {
        Museus museu = new Gson().fromJson(request.body(), Museus.class);

       
        if (museusDAO.inserirMuseu(museu)) {
            response.status(201); 
            return "Museu cadastrado com sucesso.";
        } else {
            response.status(500); 
            return "Erro ao cadastrar o museu.";
        }
    }

    // Método para buscar um museu por ID
    public Object getById(Request request, Response response) {
        int id = Integer.parseInt(request.params(":id"));
        Museus museu = museusDAO.getMuseuById(id);

        if (museu != null) {
            response.status(200);
            response.type("application/json");
            return new Gson().toJson(museu);
        } else {
            response.status(404);
            return "Museu não encontrado.";
        }
    }

    
    public Object getAll(Request request, Response response) {
        List<Museus> museusList = museusDAO.getAllMuseus();
        
        if (museusList != null) {
            response.status(200); 
            response.type("application/json"); 
            return new Gson().toJson(museusList); 
        } else {
            response.status(404); 
            return "Nenhum museu encontrado.";
        }
    }
    
    // Método para atualizar um museu
    public Object update(Request request, Response response) {
        int id = Integer.parseInt(request.params(":id"));
        Museus museuAtualizado = new Gson().fromJson(request.body(), Museus.class);
        museuAtualizado.setId(id);

        // Debugging: Verifique se todos os campos estão preenchidos corretamente
        System.out.println("Dados recebidos para atualização:");
        System.out.println("Nome: " + museuAtualizado.getNome());
        System.out.println("Descrição: " + museuAtualizado.getDescricao());
        System.out.println("Localização: " + museuAtualizado.getLocalizacao());

        if (museusDAO.atualizarMuseu(museuAtualizado)) {
            response.status(200);
            return "Museu atualizado com sucesso.";
        } else {
            response.status(404);
            return "Museu não encontrado.";
        }
    }



    // Método para remover um museu
    public Object delete(Request request, Response response) {
        int id = Integer.parseInt(request.params(":id"));
        if (museusDAO.removerMuseu(id)) {
            response.status(200);
            return "Museu deletado com sucesso.";
        } else {
            response.status(404);
            return "Museu não encontrado.";
        }
    }

}