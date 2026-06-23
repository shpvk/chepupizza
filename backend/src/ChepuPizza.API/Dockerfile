FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ChepuPizza.API/ChepuPizza.API.csproj ChepuPizza.API/
COPY ChepuPizza.BLL/ChepuPizza.BLL.csproj ChepuPizza.BLL/
COPY ChepuPizza.DAL/ChepuPizza.DAL.csproj ChepuPizza.DAL/

RUN dotnet restore ChepuPizza.API/ChepuPizza.API.csproj

COPY . .

RUN dotnet publish ChepuPizza.API/ChepuPizza.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "ChepuPizza.API.dll"]