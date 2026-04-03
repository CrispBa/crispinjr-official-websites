# Use a Node.js base image
FROM node:18

# Install Java (Required for Android Builds) and essential tools
RUN apt-get update && apt-get install -y openjdk-17-jdk wget unzip git

# Install Android SDK Command Line Tools
RUN mkdir -p /usr/local/lib/android/sdk
ENV ANDROID_SDK_ROOT /usr/local/lib/android/sdk
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O sdk.zip \
    && unzip sdk.zip -d $ANDROID_SDK_ROOT/cmdline-tools \
    && mv $ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/latest \
    && rm sdk.zip

# Set Path for Android Tools
ENV PATH $PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools

# Accept Licenses and Install Required Build Components
# This fix prevents the "Status 1" error by combining the commands correctly
RUN yes | sdkmanager --licenses
RUN sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

# Setup your application
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Match the port to Render's default (10000) as used in your server.js
EXPOSE 10000
CMD ["npm", "start"]