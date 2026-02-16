# frozen_string_literal: true

module Novabilling
  module Wallets
    module Types
      class ListWalletsRequest < Internal::Types::Model
        field :customer_id, -> { String }, optional: true, nullable: false, api_name: "customerId"
        field :status, -> { Novabilling::Wallets::Types::ListWalletsRequestStatus }, optional: true, nullable: false
        field :page, -> { Integer }, optional: true, nullable: false
        field :limit, -> { Integer }, optional: true, nullable: false
      end
    end
  end
end
