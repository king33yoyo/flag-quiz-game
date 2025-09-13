@echo off
echo 🔄 正在替换图标文件...

REM 确保在项目根目录
cd /d "%~dp0"

REM 同步到Android项目
echo 📱 同步到Android项目...
npx cap sync android

echo ✅ 图标替换完成！
echo 🎯 现在可以运行以下命令构建APK：
echo    cd android && ./gradlew assembleDebug
pause