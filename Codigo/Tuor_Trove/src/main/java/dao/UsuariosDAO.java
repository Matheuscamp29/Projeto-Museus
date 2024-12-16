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

import model.Usuario;
import security.DecryptConfigFile;
import security.MD5;

public class UsuariosDAO extends ConexaoDAO {
    
    
    // Método para conectar ao banco de dados
    public UsuariosDAO() {
        super();
    }


    


    // Método para inserir um usuário
    public boolean inserirUsuario(Usuario usuario) throws Exception {
        try {
            System.out.println("Tentando inserir usuário: " + usuario.getNome());
            
            String query = "INSERT INTO \"usuario\" (nome, email, telefone, senha) VALUES (?, ?, ?, ?)";
            PreparedStatement stmt = conexao.prepareStatement(query);
            usuario.setSenha(MD5.Hash(usuario.getSenha()));
            stmt.setString(1, usuario.getNome());
            stmt.setString(2, usuario.getEmail());
            stmt.setString(3, usuario.getTelefone());
            stmt.setString(4, usuario.getSenha());

            stmt.executeUpdate();
            stmt.close();

            System.out.println("Usuário inserido com sucesso.");
            return true;
        } catch (SQLException e) {
            System.out.println("Erro ao inserir usuário: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    // Método para listar todos os usuários
    public List<Usuario> getAllUsuarios() {
        List<Usuario> usuariosList = new ArrayList<Usuario>();
        try {
            String query = "SELECT * FROM \"usuario\"";
            PreparedStatement stmt = conexao.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Usuario usuario = new Usuario();
                usuario.setId(rs.getInt("id"));
                usuario.setNome(rs.getString("nome"));
                usuario.setEmail(rs.getString("email"));
                usuario.setTelefone(rs.getString("telefone"));
                usuario.setSenha(rs.getString("senha"));
                usuariosList.add(usuario);
            }
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            System.out.println("Erro ao listar usuários: " + e.getMessage());
        }
        return usuariosList;
    }

    // Método para buscar usuário por email
    public Usuario getUsuarioByEmail(String email) {
        Usuario usuario = null;
        try {
            String query = "SELECT * FROM \"usuario\" WHERE email = ?";
            PreparedStatement stmt = conexao.prepareStatement(query);
            stmt.setString(1, email);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                usuario = new Usuario();
                usuario.setId(rs.getInt("id"));
                usuario.setNome(rs.getString("nome"));
                usuario.setEmail(rs.getString("email"));
                usuario.setTelefone(rs.getString("telefone"));
                usuario.setSenha(rs.getString("senha"));
            }
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            System.out.println("Erro ao buscar usuário por email: " + e.getMessage());
        }
        return usuario;
    }
    
    // Método para atualizar um usuário
    public boolean atualizarUsuario(Usuario usuario) {
        try {
            String query = "UPDATE \"usuario\" SET nome = ?, email = ?, telefone = ?, senha = ? WHERE id = ?";
            PreparedStatement stmt = conexao.prepareStatement(query);
            stmt.setString(1, usuario.getNome());
            stmt.setString(2, usuario.getEmail());
            stmt.setString(3, usuario.getTelefone());
            stmt.setString(4, usuario.getSenha());
            stmt.setInt(5, usuario.getId());

            int linhasAfetadas = stmt.executeUpdate();
            stmt.close();
            return linhasAfetadas > 0;  // Retorna true se houve atualização
        } catch (SQLException e) {
            System.out.println("Erro ao atualizar usuário: " + e.getMessage());
            return false;
        }
    }
    
    // Método para remover um usuário
    public boolean removerUsuario(int id) {
        try {
            String query = "DELETE FROM \"usuario\" WHERE id = ?";
            PreparedStatement stmt = conexao.prepareStatement(query);
            stmt.setInt(1, id);

            int linhasAfetadas = stmt.executeUpdate();
            stmt.close();
            return linhasAfetadas > 0;  // Retorna true se houve remoção
        } catch (SQLException e) {
            System.out.println("Erro ao remover usuário: " + e.getMessage());
            return false;
        }
    }
}