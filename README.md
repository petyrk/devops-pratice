# CI/CD Pipeline for Deploying Next.js Portfolio App on Kubernetes 🚀

This project sets up a **CI/CD pipeline** to automatically build, test, and deploy a **Next.js** portfolio application to a **Kubernetes** cluster using **GitHub Actions**, **Docker**, **Helm**, and **Argo CD**. The entire pipeline automates the process from code push to deployment, ensuring that the latest changes are always deployed and running on the Kubernetes cluster.

---

## **Table of Contents**

- [General Overview of the Project](#general-Overview-of-the-project)
- [Dockerfile](#dockerfile)
- [Setting Up Helm](#setting-up-helm)
- [Setting Up Argo CD](#setting-up-argo-cd)
- [Triggering the Pipeline](#triggering-the-pipeline)
- [Conclusion](#conclusion)

---

## **General Overview of the Project**

This project demonstrates how to create a **CI/CD pipeline** for a **Next.js portfolio application** deployed on a **Kubernetes cluster**. The pipeline automates several tasks, including:

1. **Build**: The Next.js app is built and tested.
2. **Dockerize**: A Docker image is created to ensure consistency across environments.
3. **Push to Docker Hub**: The Docker image is pushed to Docker Hub.
4. **Update Helm Chart**: The image tag in the Helm chart is updated to the latest build.
5. **Deploy with Argo CD**: The updated application is deployed to a Kubernetes cluster.

This entire process is automated using **GitHub Actions** for continuous integration and **Argo CD** for continuous delivery.

---

## **Dockerfile**

The **Dockerfile** containerizes the Next.js portfolio app, ensuring that the application can run in any environment, including local development or production on Kubernetes.

Here is the **Dockerfile** used in the repository:

```dockerfile
# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM node:18
WORKDIR /app
COPY --from=builder /app ./
RUN npm install -g serve
EXPOSE 3000
CMD ["npm", "run", "start"]
```
The Dockerfile has two stages:

Stage 1 (Build): It installs the dependencies, copies the application code, and builds the Next.js app.
Stage 2 (Serve): It copies the built app from the previous stage and prepares it to run on a production server using serve.
You can find the Dockerfile in the root of the repository at Dockerfile.

## **Setting Up Helm**
Helm is used to deploy the Next.js app to the Kubernetes cluster. It simplifies the deployment process by using Helm charts to manage Kubernetes applications.

Steps to Set Up Helm:
Install Helm: If you haven't already, install Helm on your local machine.

Install Helm
Create Helm Chart: In the project repository, navigate to the helm/ directory where the Helm chart for the application resides.

Update Helm Values: The Helm chart's values.yaml file contains the configuration for the Kubernetes deployment. Ensure the image tag is dynamic and reflects the GitHub Actions build.

Example of the values.yaml:

``` yaml
image:
  repository: your-dockerhub-repo/nextjs-portfolio-app
  tag: latest
```
Package Helm Chart: Package the Helm chart for deployment:

``` bash
helm package ./helm

```
## **Setting Up Argo CD**
Argo CD is used to automate the deployment process to Kubernetes. It listens for changes in the repository and deploys the updated application to the cluster.

Steps to Set Up Argo CD:
Install Argo CD: Install Argo CD on your Kubernetes cluster (Minikube in this case).

```bash

kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
Expose Argo CD API Server:
```

``` bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```
Login to Argo CD: After the port-forward, login to the Argo CD UI by navigating to http://localhost:8080/. The default username is admin, and the password is the initial password retrieved with the following command:

```bash

kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```
## **Create an Argo CD Application**

Connect Argo CD to the GitHub repository where your code resides.

``` bash
argocd app create nextjs-portfolio-app \
  --repo https://github.com/your-repo/nextjs-portfolio-app.git \
  --path helm \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace default
```
Sync Argo CD Application:

After setting up the application, sync it to deploy your Next.js app to the Kubernetes cluster.

``` bash
argocd app sync nextjs-portfolio-app
```
## **Triggering the Pipeline**
Once everything is set up, every push to the main branch of the repository will trigger the GitHub Actions CI pipeline. This will run the following steps:

Install Dependencies: It installs the necessary dependencies for the Next.js app.
Lint and Test: Lints the code and runs tests.
Build Docker Image: Builds a Docker image of the app.
Push to Docker Hub: Pushes the Docker image to Docker Hub.
Update Helm Chart: Updates the values.yaml in the Helm chart with the new image tag.
Deploy with Argo CD: Argo CD automatically detects the change and deploys the new image to Kubernetes.
Screenshot Placeholder:
P showing the GitHub Actions workflow running successfully, with logs showing build, test, and Docker push.

Screenshot Placeholder:
showing the Argo CD UI with the app deployment triggered and synced successfully.

Screenshots: CI/CD Pipeline in Action
GitHub Actions Workflow:

Argo CD Sync:

##  **Conclusion**
This setup allows you to automate the deployment of a Next.js portfolio application to a Kubernetes cluster using a CI/CD pipeline. By using GitHub Actions for continuous integration and Argo CD for continuous delivery, you ensure that the application is always up-to-date with the latest code changes, while Helm simplifies the Kubernetes deployment process.

By using Docker, you ensure that the app runs in a consistent environment across all stages of the pipeline, whether it's local development or production.

With everything automated, you can now focus on writing new features and making improvements to your portfolio app while the pipeline handles the rest!

