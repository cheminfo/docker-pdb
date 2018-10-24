## Installation

- Clone the project
- `cd docker-pdb`
- `cp .env.example .env`
- Edit the .env to set port and password
- `docker-compose up -d`

If you are using selinux you should also apply the following command: `chcon -R -t container_file_t docker-pdb`

The first time it will take days to create the database from scratch.

You can check the evolution using the homepage of the project ie http://localhost:XXXX where `XXXX` is the port number specified in the `.env` file.
