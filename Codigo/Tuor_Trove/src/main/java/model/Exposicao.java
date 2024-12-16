package model;

public class Exposicao {
    private int id;
    private String nome;
    private String descricao;
    private int id_museu;

    public Exposicao() {}

    public Exposicao(String nome, String descricao, int id_museu) {
        this.nome = nome;
        this.descricao = descricao;
        this.id_museu = id_museu;
    }

    // Getters e Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public int getId_museu() { return id_museu; }
    public void setId_museu(int id_museu) { this.id_museu = id_museu; }
}