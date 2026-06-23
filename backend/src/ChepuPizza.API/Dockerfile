FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/ChepuPizza.API/ChepuPizza.API.csproj src/ChepuPizza.API/
COPY src/ChepuPizza.BLL/ChepuPizza.BLL.csproj src/ChepuPizza.BLL/
COPY src/ChepuPizza.DAL/ChepuPizza.DAL.csproj src/ChepuPizza.DAL/

RUN dotnet restore src/ChepuPizza.API/ChepuPizza.API.csproj

COPY . .

RUN dotnet publish src/ChepuPizza.API/ChepuPizza.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "ChepuPizza.API.dll"]