# frozen_string_literal: true

module Novabilling
  module Wallets
    module Types
      class UpdateWalletDto < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :name, -> { String }, optional: true, nullable: false
        field :expiration_at, -> { String }, optional: true, nullable: false, api_name: "expirationAt"
        field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      end
    end
  end
end
