# Use a Node.js base image
FROM node:18

# Install Java (Required for Android Builds)
RUN apt-get update && apt-get install -y openjdk-17-jdk wget unzip

# Install Android SDK Command Line Tools
RUN mkdir -p /usr/local/lib/android/sdk
ENV ANDROID_SDK_ROOT /usr/local/lib/android/sdk
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O sdk.zip \
    && unzip sdk.zip -d $ANDROID_SDK_ROOT/cmdline-tools \
    && mv $ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/latest \
    && rm sdk.zip

# Set Path
ENV PATH $PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools

# Accept Licenses
RUN yes | sdkmanager --licenses

# Setup your app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]