# frozen_string_literal: true

module Novabilling
  module Types
    class RegisterResponse < Internal::Types::Model
      field :access_token, -> { String }, optional: false, nullable: false, api_name: "accessToken"
      field :refresh_token, -> { String }, optional: false, nullable: false, api_name: "refreshToken"
      field :tenant, -> { Novabilling::Types::TenantInfoResponse }, optional: false, nullable: false
      field :api_key, -> { String }, optional: false, nullable: false, api_name: "apiKey"
    end
  end
end
