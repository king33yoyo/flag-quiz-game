@echo off
chcp 65001 >nul
echo.
echo ===================================
echo   国旗问答游戏 - Release APK 构建助手
echo ===================================
echo.

REM 检查Java环境
java -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未检测到Java环境，请先安装Java JDK
    pause
    exit /b 1
)

echo ✅ Java环境检查通过

REM 检查keytool工具
keytool -help >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未检测到keytool工具，请确保Java JDK已正确安装
    pause
    exit /b 1
)

echo ✅ Keytool工具检查通过

echo.
echo 🔑 开始生成密钥库...
echo.

REM 设置默认值
set "STORE_PASSWORD=FlagQuiz2024"
set "KEY_PASSWORD=FlagQuiz2024"
set "KEY_ALIAS=flagquiz"
set "KEYSTORE_FILE=flag-quiz-game.keystore"

REM 检查密钥库是否已存在
if exist "%KEYSTORE_FILE%" (
    echo ⚠️  密钥库文件已存在: %KEYSTORE_FILE%
    echo.
    set /p overwrite="是否覆盖现有密钥库? (y/n): "
    if /i "%overwrite%" neq "y" (
        echo 使用现有密钥库继续构建...
        goto :build_release
    )
)

echo 正在生成新的密钥库...
echo.

REM 使用预设的DN信息
set "DN_INFO=CN=king33yoyo, OU=游戏开发, O=国旗问答游戏, L=shenzhen, ST=guangdong, C=cn"

REM 生成密钥库
keytool -genkeypair -v ^
-keystore "%KEYSTORE_FILE%" ^
-alias "%KEY_ALIAS%" ^
-keyalg RSA ^
-keysize 2048 ^
-validity 10000 ^
-storepass "%STORE_PASSWORD%" ^
-keypass "%KEY_PASSWORD%" ^
-dname "%DN_INFO%"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ 密钥库生成失败！
    echo 请手动运行以下命令：
    echo keytool -genkeypair -v -keystore %KEYSTORE_FILE% -alias %KEY_ALIAS% -keyalg RSA -keysize 2048 -validity 10000
    pause
    exit /b 1
)

echo.
echo ✅ 密钥库生成成功！
echo 密钥库文件: %KEYSTORE_FILE%
echo 别名: %KEY_ALIAS%
echo.

REM 创建gradle.properties文件
echo > gradle.properties
echo STORE_FILE=%KEYSTORE_FILE% >> gradle.properties
echo STORE_PASSWORD=%STORE_PASSWORD% >> gradle.properties
echo KEY_ALIAS=%KEY_ALIAS% >> gradle.properties
echo KEY_PASSWORD=%KEY_PASSWORD% >> gradle.properties

echo ✅ gradle.properties 配置文件已创建

:build_release
echo.
echo 🚀 开始构建Release APK...
echo.

REM 清理项目
call gradlew clean
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 项目清理失败
    pause
    exit /b 1
)

echo ✅ 项目清理完成

REM 构建Release APK
call gradlew assembleRelease
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Release APK构建失败
    pause
    exit /b 1
)

echo.
echo ===================================
echo   🎉 Release APK 构建完成！
echo ===================================
echo.

REM 检查APK文件
set "APK_PATH=app\build\outputs\apk\release\app-release.apk"
if exist "%APK_PATH%" (
    echo 📦 APK文件位置: %APK_PATH%
    echo 📏 文件大小: 
    for %%F in ("%APK_PATH%") do echo %%~zF 字节
    
    echo.
    echo 🔍 APK信息:
    keytool -printcert -jarfile "%APK_PATH%"
    
    echo.
    echo ✅ 构建成功！您现在可以:
    echo   1. 安装到Android设备测试
    echo   2. 上传到应用商店发布
    echo   3. 分发给其他人使用
    
) else (
    echo ❌ 未找到APK文件，请检查构建过程
)

echo.
echo ⚠️  重要提醒:
echo   1. 请备份密钥库文件: %KEYSTORE_FILE%
echo   2. 不要将密钥库提交到版本控制
echo   3. 保管好密钥库密码
echo.

pause