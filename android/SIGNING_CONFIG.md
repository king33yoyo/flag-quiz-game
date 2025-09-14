# Release APK构建配置模板

## 原始build.gradle文件位置
android/app/build.gradle

## 需要添加的签名配置

将以下内容添加到 android 块中（在 defaultConfig 之后）：

```gradle
android {
    namespace "com.flagquiz.game"
    compileSdk rootProject.ext.compileSdkVersion
    defaultConfig {
        applicationId "com.flagquiz.game"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        aaptOptions {
            ignoreAssetsPattern '!.svn:!.git:!.ds_store:!*.scc:.*:!CVS:!thumbs.db:!picasa.ini:!*~'
        }
    }
    
    // =========== 添加以下签名配置 ===========
    signingConfigs {
        release {
            storeFile file('flag-quiz-game.keystore')
            storePassword 'FlagQuiz2024'
            keyAlias 'flagquiz'
            keyPassword 'FlagQuiz2024'
        }
    }
    // ========================================
    
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
            // =========== 添加以下行 ===========
            signingConfig signingConfigs.release
            // ==================================
        }
    }
}
```

## 完整的gradle.properties文件内容

创建或编辑 android/gradle.properties：

```properties
# Project-wide Gradle settings.
org.gradle.jvmargs=-Xmx1536M
android.useAndroidX=true
android.enableJetifier=true

# 密钥库配置
STORE_FILE=flag-quiz-game.keystore
STORE_PASSWORD=FlagQuiz2024
KEY_ALIAS=flagquiz
KEY_PASSWORD=FlagQuiz2024
```

## 简化的build.gradle（直接使用gradle.properties）

```gradle
android {
    // ... 其他配置保持不变 ...
    
    signingConfigs {
        release {
            storeFile file(STORE_FILE)
            storePassword STORE_PASSWORD
            keyAlias KEY_ALIAS
            keyPassword KEY_PASSWORD
        }
    }
    
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }
}
```

## 注意事项

1. **密钥库文件位置**: 放在 android/flag-quiz-game.keystore
2. **密码安全**: 在实际发布时，建议使用更复杂的密码
3. **版本控制**: 不要将keystore文件提交到Git
4. **备份**: 密钥库文件一旦丢失，将无法更新应用