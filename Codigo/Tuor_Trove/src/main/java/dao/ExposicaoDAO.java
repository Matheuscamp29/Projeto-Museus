package dao;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import model.Exposicao;
import security.DecryptConfigFile;

public class ExposicaoDAO extends ConexaoDAO {
    
	// Método para conectar ao banco de dados
	public ExposicaoDAO(){
		super();
	}
   

    
    // Método para inserir uma exposição
    public boolean inserirExposicao(Exposicao exposicao) {
        try {
            System.out.println("Tentando inserir exposição: " + exposicao.getNome());

            String query = "INSERT INTO \"exposicao\" (nome, descricao, id_museu) VALUES (?, ?, ?)";
            PreparedStatement stmt = conexao.prepareStatement(query);
            stmt.setString(1, exposicao.getNome());
            stmt.setString(2, exposicao.getDescricao());
            stmt.setInt(3, exposicao.getId_museu());

            stmt.executeUpdate();
            stmt.close();

            System.out.println("Exposição inserida com sucesso.");
            return true;
        } catch (SQLException e) {
            System.out.println("Erro ao inserir exposição: " + e.getMessage());
            e.printStackTrace(); 
            return false;
        }
    }
    
    // Método para listar todas as exposições
    public List<Exposicao> getAllExposicoes() {
        List<Exposicao> exposicoesList = new ArrayList<Exposicao>();
        try {
            String query = "SELECT * FROM \"exposicao\"";
            PreparedStatement stmt = conexao.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Exposicao exposicao = new Exposicao();
                exposicao.setId(rs.getInt("id"));
                exposicao.setNome(rs.getString("nome"));
                exposicao.setDescricao(rs.getString("descricao"));
                exposicao.setId_museu(rs.getInt("id_museu"));
                exposicoesList.add(exposicao);
            }
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            System.out.println("Erro ao listar exposições: " + e.getMessage());
        }
        return exposicoesList;
    }

    // Método para buscar a exposição pelo nome
    public Exposicao getExposicaoByNome(String nome) {
        Exposicao exposicao = null;
        try {
            String query = "SELECT * FROM \"exposicao\" WHERE LOWER(nome) = LOWER(?)";
            PreparedStatement stmt = conexao.prepareStatement(query);
            stmt.setString(1, nome);
            System.out.println("Consulta SQL: " + stmt.toString());
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                exposicao = new Exposicao();
                exposicao.setId(rs.getInt("id"));
                exposicao.setNome(rs.getString("nome"));
                exposicao.setDescricao(rs.getString("descricao"));
                exposicao.setId_museu(rs.getInt("id_museu"));
            }
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            System.out.println("Erro ao buscar exposição por nome: " + e.getMessage());
        }
        return exposicao;
    }
    
    // Método para buscar uma exposição pelo ID
    public Exposicao getExposicaoById(int id) {
        Exposicao exposicao = null;
        try {
            String query = "SELECT * FROM \"exposicao\" WHERE id = ?";
            PreparedStatement stmt = conexao.prepareStatement(query);
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                exposicao = new Exposicao();
                exposicao.setId(rs.getInt("id"));
                exposicao.setNome(rs.getString("nome"));
                exposicao.setDescricao(rs.getString("descricao"));
                exposicao.setId_museu(rs.getInt("id_museu"));
            }
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            System.out.println("Erro ao buscar exposição por ID: " + e.getMessage());
        }
        return exposicao;
    }

    // Método para buscar uma exposição pelo ID de um museu
    public List<Exposicao> getExposicoesByMuseuId(int id_museu) {
        List<Exposicao> exposicoesList = new ArrayList<Exposicao>();
        try {
            String query = "SELECT * FROM \"exposicao\" WHERE id_museu = ?";
            PreparedStatement stmt = conexao.prepareStatement(query);
            stmt.setInt(1, id_museu);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Exposicao exposicao = new Exposicao();
                exposicao.setId(rs.getInt("id"));
                exposicao.setNome(rs.getString("nome"));
                exposicao.setDescricao(rs.getString("descricao"));
                exposicao.setId_museu(rs.getInt("id_museu"));
                exposicoesList.add(exposicao);
            }
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            System.out.println("Erro ao listar exposições por museu: " + e.getMessage());
        }
        return exposicoesList;
    }
    
    // Método para atualizar uma exposição
    public boolean atualizarExposicao(Exposicao exposicao) {
        try {
            String query = "UPDATE \"exposicao\" SET nome = ?, descricao = ?, id_museu = ? WHERE id = ?";
            PreparedStatement stmt = conexao.prepareStatement(query);
            stmt.setString(1, exposicao.getNome());
            stmt.setString(2, exposicao.getDescricao());
            stmt.setInt(3, exposicao.getId_museu());
            stmt.setInt(4, exposicao.getId());

            int linhasAfetadas = stmt.executeUpdate();
            stmt.close();
            return linhasAfetadas > 0;
        } catch (SQLException e) {
            System.out.println("Erro ao atualizar exposição: " + e.getMessage());
            return false;
        }
    }
    
    // Método para remover uma exposição
    public boolean removerExposicao(int id) {
        try {
            String query = "DELETE FROM \"exposicao\" WHERE id = ?";
            PreparedStatement stmt = conexao.prepareStatement(query);
            stmt.setInt(1, id);

            int linhasAfetadas = stmt.executeUpdate();
            stmt.close();
            return linhasAfetadas > 0;
        } catch (SQLException e) {
            System.out.println("Erro ao remover exposição: " + e.getMessage());
            return false;
        }
    }  
}