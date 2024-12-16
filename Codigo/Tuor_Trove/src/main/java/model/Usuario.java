package model;

public class Usuario {
	
    private int id;
    private String nome;
    private String senha;
    private String telefone;
    private String email;
    
 // Construtores
    public Usuario() {}

    public Usuario(int id, String nome, String senha, String telefone, String email) {
        this.id = id;
        this.nome = nome;
        this.senha = senha;
        this.telefone = telefone;
        this.email = email;
    }
    
    // Getters
    public int getId() { return id; }
    
    public String getNome() { return nome; }
    
    public String getSenha() { return senha; }
    
    public String getTelefone() { return telefone; }
    
    public String getEmail() { return email; }
    
    // Setters
    public void setId(int id) { this.id = id; }
    
    public void setNome(String nome) { this.nome = nome; }
    
    public void setSenha(String senha) { this.senha = senha; }
    
    public void setTelefone(String telefone) { this.telefone = telefone; }
    
    public void setEmail(String email) { this.email = email; }
    
}