# Script para conectar e publicar o projeto no GitHub
# Certifique-se de que o repositório remoto está criado e vazio.

Write-Host "Configurando repositório remoto..." -ForegroundColor Cyan
git remote add origin https://github.com/maryreginaf15/jogoremake-megamania.git

Write-Host "Renomeando branch para main..." -ForegroundColor Cyan
git branch -M main

Write-Host "Enviando arquivos para o GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host "Projeto publicado com sucesso!" -ForegroundColor Green
