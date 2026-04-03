# Use a Node.js base image
FROM node:18 [cite: 2]

# Install Java and essential build tools
RUN apt-get update && apt-get install -y openjdk-17-jdk wget unzip git 

# Install Android SDK Command Line Tools
RUN mkdir -p /usr/local/lib/android/sdk 
ENV ANDROID_SDK_ROOT /usr/local/lib/android/sdk [cite: 2]
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O sdk.zip \
    && unzip sdk.zip -d $ANDROID_SDK_ROOT/cmdline-tools \
    && mv $ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/latest \
    && rm sdk.zip 

# Set Path
ENV PATH $PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools [cite: 2]

# Accept Licenses and Install Build Components
RUN yes | sdkmanager --licenses 
RUN sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

# Setup your app directory
WORKDIR /app 
COPY package*.json ./ 
RUN npm install 
COPY . . 

# Match the port to Render's default
EXPOSE 10000
CMD ["npm", "start"]