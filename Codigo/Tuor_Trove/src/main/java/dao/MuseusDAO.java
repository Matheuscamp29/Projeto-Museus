package dao;

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

import model.Museus;
import security.DecryptConfigFile;

public class MuseusDAO extends ConexaoDAO {
    

    // Método para conectar ao banco de dados
    public MuseusDAO() {
        super();
    }

    
    // Método para inserir um museu
    public boolean inserirMuseu(Museus museu) {
        try {
            System.out.println("Tentando inserir museu: " + museu.getNome());

            String query = "INSERT INTO \"museu\" (nome, descricao, localizacao) VALUES (?, ?, ?)";
            PreparedStatement stmt = conexao.prepareStatement(query);
            stmt.setString(1, museu.getNome());
            stmt.setString(2, museu.getDescricao());
            stmt.setString(3, museu.getLocalizacao());

            stmt.executeUpdate();
            stmt.close();

            System.out.println("Museu inserido com sucesso.");
            return true;
        } catch (SQLException e) {
            System.out.println("Erro ao inserir museu: " + e.getMessage());
            e.printStackTrace(); 
            return false;
        }
    }

    // Método para listar todos os museus
    public List<Museus> getAllMuseus() {
        List<Museus> museusList = new ArrayList<Museus>();
        try {
            String query = "SELECT * FROM \"museu\"";
            PreparedStatement stmt = conexao.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Museus museu = new Museus();
                museu.setId(rs.getInt("id"));
                museu.setNome(rs.getString("nome"));
                museu.setDescricao(rs.getString("descricao"));
                museu.setLocalizacao(rs.getString("localizacao"));
                museusList.add(museu);
            }
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
        return museusList;
    }
    
    // Método para buscar um museu pelo ID
    public Museus getMuseuById(int id) {
        Museus museu = null;
        try {
            String query = "SELECT * FROM museu WHERE id = ?";
            PreparedStatement stmt = conexao.prepareStatement(query);
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                museu = new Museus();
                museu.setId(rs.getInt("id"));
                museu.setNome(rs.getString("nome"));
                museu.setDescricao(rs.getString("descricao"));
                museu.setLocalizacao(rs.getString("localizacao"));
            }
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            System.out.println("Erro ao buscar museu por ID: " + e.getMessage());
        }
        return museu;
    }


    // Método para atualizar um museu
    public boolean atualizarMuseu(Museus museu) {
        try {
            String query = "UPDATE \"museu\" SET nome = ?, descricao = ?, localizacao = ? WHERE id = ?";
            PreparedStatement stmt = conexao.prepareStatement(query);
            stmt.setString(1, museu.getNome());
            stmt.setString(2, museu.getDescricao());
            stmt.setString(3, museu.getLocalizacao());
            stmt.setInt(4, museu.getId());

            int linhasAfetadas = stmt.executeUpdate();
            stmt.close();
            return linhasAfetadas > 0;
        } catch (SQLException e) {
            System.out.println("Erro ao atualizar museu: " + e.getMessage());
            return false;
        }
    }
    
 // Método para remover um museu
    public boolean removerMuseu(int id) {
        try {
            String query = "DELETE FROM \"museu\" WHERE id = ?";
            PreparedStatement stmt = conexao.prepareStatement(query);
            stmt.setInt(1, id);

            int linhasAfetadas = stmt.executeUpdate();
            stmt.close();
            return linhasAfetadas > 0;
        } catch (SQLException e) {
            System.out.println("Erro ao remover museu: " + e.getMessage());
            return false;
        }
    }
}
