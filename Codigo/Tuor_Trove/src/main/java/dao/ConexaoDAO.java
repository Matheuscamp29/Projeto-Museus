package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

import security.DecryptConfigFile;

public class ConexaoDAO {
	protected Connection conexao;

    public ConexaoDAO() {
        conexao = null;
    }

	 public boolean conectar() {
	        try {
	            // Descriptografa o arquivo para obter as propriedades
	            String key = "sua chave";  // Substitua pela chave gerada
	            String encryptedConfigPath = "src/main/resources/config_encrypted.properties";
	            Properties props = DecryptConfigFile.decryptFile(key, encryptedConfigPath);

	            String driverName = props.getProperty("driverName");
	            
	            String username = props.getProperty("username");
	            String password = props.getProperty("password");

	            String serverName = props.getProperty("serverName");
	            
				
	            String myDataBase = props.getProperty("myDataBase");
	            String port = props.getProperty("port");
	            String url = props.getProperty("url");
	            
	            // Carrega o driver e estabelece a conexão
	            Class.forName(driverName);
	            conexao = DriverManager.getConnection(url, username, password);
	            System.out.println("Conexão estabelecida com sucesso.");
	            return true;
	        } catch (Exception e) {
	            System.err.println("Erro ao carregar o arquivo de configuração: " + e.getMessage());
	            return false;
	        }
	    }
	
}
