# 🔧 Troubleshooting - Sistema de Gravação

## ❌ Erro: "I/O error" ou "Error opening input file"

### **Causa:**
O FFmpeg não conseguiu acessar a URL da câmera. Isso pode acontecer por vários motivos:

### **Possíveis Problemas:**

#### 1. **Câmera Offline ou Inacessível**
- A câmera pode estar desligada
- A câmera pode estar fora da rede
- Problema de conectividade

**Solução:**
- Verifique se a câmera está ligada
- Teste a URL no navegador: `http://61.211.241.239/nphMotionJpeg?Resolution=320x240&Quality=Standard`
- Verifique se a câmera está na mesma rede

---

#### 2. **Firewall Bloqueando**
- Firewall da rede bloqueando conexões
- Firewall do servidor bloqueando saída
- Firewall da câmera bloqueando entrada

**Solução:**
- Verifique regras de firewall
- Teste de outro dispositivo na mesma rede
- Configure exceções no firewall

---

#### 3. **URL Incorreta**
- URL mal formatada
- IP ou porta errados
- Caminho do stream incorreto

**Solução:**
- Verifique a URL no banco de dados
- Teste a URL manualmente
- Consulte a documentação da câmera

---

#### 4. **Autenticação Necessária**
- Câmera requer usuário/senha
- Token de acesso necessário
- Autenticação básica HTTP

**Solução:**
- Adicione credenciais na URL: `http://usuario:senha@ip/caminho`
- Configure autenticação na câmera
- Use tokens se disponível

---

#### 5. **Timeout de Conexão**
- Câmera muito lenta para responder
- Rede instável
- Timeout muito curto

**Solução:**
- Aumente o timeout (já configurado para 10s)
- Verifique a velocidade da rede
- Teste ping na câmera

---

## ✅ Melhorias Implementadas

### **1. Validação Prévia (HTTP/HTTPS)**
Antes de iniciar o FFmpeg, o sistema agora valida se a URL está acessível:

```
🔍 Validando acessibilidade do stream...
✅ Stream acessível (200) - 234ms
```

Se falhar, retorna erro antes de tentar gravar:
```
❌ Stream não está acessível: timeout
```

### **2. Opções de Reconexão**
Para streams HTTP, foram adicionadas opções de reconexão automática:
- `-reconnect 1` - Tenta reconectar se desconectar
- `-reconnect_delay_max 2` - Máximo 2s entre tentativas
- `-timeout 10000000` - Timeout de 10 segundos

### **3. Mensagens de Erro Melhoradas**
Agora as mensagens são mais descritivas:

**Antes:**
```
Error opening input file: I/O error
```

**Depois:**
```
Não foi possível acessar a câmera. Verifique se:
- A câmera está online e acessível
- A URL está correta: http://...
- Não há firewall bloqueando a conexão
- A câmera não requer autenticação adicional
```

---

## 🧪 Como Testar

### **1. Testar URL no Navegador**
Abra a URL da câmera no navegador:
```
http://61.211.241.239/nphMotionJpeg?Resolution=320x240&Quality=Standard
```

**Se funcionar:** Você verá o stream da câmera  
**Se não funcionar:** A câmera está inacessível

### **2. Testar com curl**
```bash
curl -I http://61.211.241.239/nphMotionJpeg?Resolution=320x240&Quality=Standard
```

**Resposta esperada:**
```
HTTP/1.1 200 OK
Content-Type: multipart/x-mixed-replace; boundary=...
```

### **3. Testar com FFmpeg Diretamente**
```bash
ffmpeg -i "http://61.211.241.239/nphMotionJpeg?Resolution=320x240&Quality=Standard" -t 5 test.mp4
```

**Se funcionar:** Arquivo será criado  
**Se não funcionar:** Verifique o erro do FFmpeg

### **4. Testar Ping**
```bash
ping 61.211.241.239
```

**Se funcionar:** Câmera está na rede  
**Se não funcionar:** Problema de conectividade

---

## 🔍 Logs Úteis

### **Log de Validação:**
```
🔍 Validando acessibilidade do stream...
✅ Stream acessível (200) - 234ms
```

### **Log de Erro de Validação:**
```
🔍 Validando acessibilidade do stream...
❌ Erro ao validar stream (5000ms): timeout
```

### **Log de Erro do FFmpeg:**
```
❌ Erro no FFmpeg: Error opening input file: I/O error
FFmpeg stderr: [detalhes do erro]
```

---

## 📋 Checklist de Diagnóstico

Antes de reportar erro, verifique:

- [ ] Câmera está ligada?
- [ ] URL está correta no banco?
- [ ] URL funciona no navegador?
- [ ] Ping na câmera funciona?
- [ ] Firewall não está bloqueando?
- [ ] Câmera requer autenticação?
- [ ] Rede está estável?
- [ ] FFmpeg está instalado?

---

## 🆘 Se Nada Funcionar

1. **Verifique os logs completos** no terminal
2. **Teste a URL manualmente** no navegador
3. **Verifique a configuração da câmera** no banco de dados
4. **Teste de outro dispositivo** na mesma rede
5. **Consulte a documentação da câmera** para URL correta

---

## 📝 Exemplo de URL Correta

### **HTTP/MJPEG:**
```
http://192.168.1.100/nphMotionJpeg?Resolution=640x480&Quality=Standard
```

### **RTSP:**
```
rtsp://admin:senha@192.168.1.100:554/Streaming/Channels/101
```

### **Com Autenticação HTTP:**
```
http://admin:senha@192.168.1.100/video
```

---

**Última atualização:** 19/01/2026
