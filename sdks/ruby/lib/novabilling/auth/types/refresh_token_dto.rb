# frozen_string_literal: true

module Novabilling
  module Auth
    module Types
      class RefreshTokenDto < Internal::Types::Model
        field :refresh_token, -> { String }, optional: false, nullable: false, api_name: "refreshToken"
      end
    end
  end
end
