# frozen_string_literal: true

module Novabilling
  module Types
    class UsageEventResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :transaction_id, -> { String }, optional: false, nullable: false, api_name: "transactionId"
      field :subscription_id, -> { String }, optional: false, nullable: false, api_name: "subscriptionId"
      field :code, -> { String }, optional: false, nullable: false
      field :timestamp, -> { String }, optional: false, nullable: false
      field :properties, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
    end
  end
end
