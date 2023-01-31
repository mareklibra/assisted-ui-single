# Assisted Installer Single Cluster WebUI
The web UI for agent-based installation of the OpenShift Cluster.

It's React + Patternfly + PNPM + Vite application, heavily depending on the https://github.com/openshift-assisted/assisted-ui-lib library.

The flow is focused to on-prem bare-metal installation, including disconnected environment.

More info about
- agent-based installation: https://github.com/openshift/installer/tree/master/docs/user/agent
- dev-scripts agent: https://github.com/openshift-metal3/dev-scripts/tree/master/agent

## Prerequisites
For the UI itself, only a running [assisted-service](https://github.com/openshift/assisted-service) is required.


In reality, the project is expected to provide the UI for single-cluster on-prem installation which includes:

- user downloads generic installation ISO, among the others includes container image with this Web UI (TBD: more details about the ISO)
- user boots all nodes with it
- when prompted in the console, chooses exactly one machine to be the **node0** and provides basic network configuration on all nodes
- **subsequently, the node0 executes the assisted-service and the Web UI (this application) in containers on the bare-metal**
- **the user navigates to this Web UI in a browser**
- **by passing through a wizard, the users enters details about the desired cluster while examining the rest of the hosts automatically discovered**
- once the configuration is done, the node0 is rebooted to join the newly created OCP cluster


In other words, the UI execution is one-time, ephemeral, same as is the lifespan of the assisted-service in that setup. Once the desired cluster configuration is collected via UI and persisted in the assisted-service, an agent ISO is created by executing assisted-installer and that is used to reboot the hosts (future nodes). The node0 (up to this moment hosting the UI and assisted-service) is rebooted with the new ISO and joins the new cluster. The former assisted-service and the UI containers are gone with all its data and never accessed again. All subsequent configuration, including scale-up (adding hosts) is expected to be done on the command-line or via OpenShift Console Web UI.

## Development

### Development prerequisites
Considering the flow described above, the assisted-service is required prior to execution of the Web UI.

For the development purposes, [dev-scripts](https://github.com/openshift-metal3/dev-scripts/tree/master/agent) can be used.
Follow the documentation there but in a nutshell:
```
$ git clone https://github.com/openshift-metal3/dev-scripts.git
$cd dev-scripts
```

Do not skip
- https://github.com/openshift-metal3/dev-scripts#preparation
- https://github.com/openshift-metal3/dev-scripts/blob/master/agent/README.md

as a hint, following was successfully used so far in the "config_[user].sh":

```
export CI_TOKEN="__FILL_IN__"
export AGENT_DISABLE_AUTOMATED=true # To prevent auto-triggering installation

export IP_STACK=v4
export NETWORK_TYPE="OpenShiftSDN"
export AGENT_E2E_TEST_SCENARIO=COMPACT_IPV4

export WORKING_DIR=/home/dev-scripts
export MASTER_MEMORY=16384
export MASTER_DISK=120
export MASTER_VCPU=8
export NUM_WORKERS=0

```

```
$ nohup make agent
```

These steps should result in a running assisted-service in a container.
To verify:
```
$ curl http://192.168.111.80:8090/api/assisted-install/v2/clusters
[] 

# so no error is returned, just an empty json array
```

Once the assisted-service is running, the web UI can be initially configured via:
```
$ git clone https://github.com/mareklibra/assisted-ui-single.git
$ cd github.com/mareklibra/assisted-ui-single
$ pnpm install
```

The pnpm tool can be downloaded from: https://pnpm.io/installation

### Setting up assisted-ui-lib for development
This project heavily depends on the https://github.com/openshift-assisted/assisted-ui-lib library, in fact this project is meant to be just a thin wrapper around it.

To modify the library and immediately see hot-deployed changes, follow:
```
cd ~/src/assisted-ui-single/node_modules
rm -f ./openshift-assisted-ui-lib
mkdir ./openshift-assisted-ui-lib
cd ./openshift-assisted-ui-lib
ln -s ../../../assisted-ui-lib/package.json ./
ln -s ../../../assisted-ui-lib/dist ./
cd ~/src/assisted-ui-lib
yarn start

```

### The Day2Day Goal: Running the Application Dev Server
Once Development prerequisites are met, following commands can be used to run the Web UI for development:

```
VITE_ASSISTED_SERVICE_API=http://192.168.111.80:8090 pnpm dev --debug
```

The URL above is the URL of the assisted-service.

## Production
Please refer to Prerequisites listed above for the context.

### Production Build
On a build machine:

```
$ podman build . -f Dockerfile -t quay.io/mlibra/assisted-ui-single:latest
```

### Production start
On the node0:
```
$ sudo /usr/bin/podman run -d --name=assisted-ui --network=host --pod-id-file=/run/assisted-service-pod.pod-id quay.io/mlibra/assisted-ui-single:latest
```

## Unit Tests
```
$ pnpm test
```

## Integration Tests
### Development of Integration Tests
Have a running application dev server, adjust the URL bellow accordingly:

```
CYPRESS_BASE_URL=http://localhost:5173 pnpm cypress:open
```

### Build Containerized Integration Tests
```
$ podman build . -f Dockerfile.e2e.tests -t quay.io/mlibra/assisted-ui-single-tests:latest
```

Please refer to the Dockerfile.e2e.tests for the browser version being used and additional setup.

### Run Containerized Integration Tests
```
# Provide params
export CYPRESS_RECORDINGS=./cypress.recordings # whatever directory, can be /tmp
export CYPRESS_BASE_URL=http://localhost:5173 # The URLof the application

# Prepare storage for recordings
rm -rf ${CYPRESS_RECORDINGS}
mkdir -p ${CYPRESS_RECORDINGS}/video ${CYPRESS_RECORDINGS}/screenshots

# headless execution
podman run -it -w /e2e --network=host \
  -e CYPRESS_BASE_URL \ 
  -v ${CYPRESS_RECORDINGS}/video:/e2e/cypress/videos:Z \
  -v ${CYPRESS_RECORDINGS}/screenshots:/e2e/cypress/screenshots:Z \
  quay.io/mlibra/assisted-ui-single-tests:latest \
  --browser chrome
```
