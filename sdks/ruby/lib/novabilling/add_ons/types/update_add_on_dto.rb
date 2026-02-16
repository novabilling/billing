# frozen_string_literal: true

module Novabilling
  module AddOns
    module Types
      class UpdateAddOnDto < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :name, -> { String }, optional: true, nullable: false
        field :description, -> { String }, optional: true, nullable: false
        field :invoice_display_name, -> { String }, optional: true, nullable: false, api_name: "invoiceDisplayName"
        field :prices, -> { Internal::Types::Array[Novabilling::Types::AddOnPriceDto] }, optional: true, nullable: false
      end
    end
  end
end
